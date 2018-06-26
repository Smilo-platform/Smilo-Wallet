declare const sjcl: any;
import "seedrandom";
import { LamportGeneratorThread, ILamportGeneratorThreadInput, ILamportGeneratorThreadOutput } from "./LamportGenerator";
import { Pool } from "threads";
import { Storage } from "@ionic/storage";
import { KeyStoreService } from "../services/key-store-service/key-store-service";
import { IWallet } from "../models/IWallet";
import { IKeyStore } from "../models/IKeyStore";
import { Platform } from "ionic-angular/platform/platform";

export interface IMerkleTreeConfig {
    version: number;
    layerCount: number;
}

export class MerkleTree {
    private static readonly KEYS_PER_JOB = 100;
    private static readonly VERSION = 1;
    private static md256;

    layers: string[][];
    
    // Constructor hidden to force the user to construct this object using static functions.
    protected constructor(layers: string[][]) {
        this.layers = layers;
    }

    getPublicKey(): string {
        let preAddress = MerkleTree.sha256Base32(
            this.layers[this.layers.length - 1][0]
        ).substr(0, 32);

        let addressPrefix = this.getPublicKeyPrefix();

        let checksum = MerkleTree.sha256Base32(
            addressPrefix +
            preAddress
        );

        let publicKey =  addressPrefix +
                         preAddress +
                         checksum.substr(0, 4);

        return publicKey;
    }

    serialize(storagePrefix: string, storage: Storage, keyStoreService: KeyStoreService, password: string): Promise<void> {
        let promises: Promise<void>[] = [];

        let config: IMerkleTreeConfig = {
            layerCount: this.layers.length,
            version: MerkleTree.VERSION
        };

        promises.push(
            storage.set(`${ storagePrefix }-config`, config)
        );

        for(let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];

            let encrypted = keyStoreService.createKeyStore(
                JSON.stringify(layer),
                password
            );

            promises.push(
                storage.set(`${ storagePrefix }-layer-${ i }`, encrypted)
            );
        }

        return Promise.all(promises).then<void>();
    }

    private getPublicKeyPrefix(): string {
        switch(this.layers.length) {
            case(14):
                return "S1";
            case(15):
                return "S2";
            case(16):
                return "S3";
            case(17):
                return "S4";
            case(18):
                return "S5";
            default:
                return "A1";
        }
    }

    static generate(privateKey: string, layerCount: number, platform: Platform, progressUpdate?: (progress: number) => void): Promise<MerkleTree> {
        return MerkleTree.generateLeafKeys(privateKey, layerCount, platform, progressUpdate).then(
            (publicKeys) => {
                return new MerkleTree(MerkleTree.generateLayers(publicKeys, layerCount));
            }
        );
    }

    static fromDisk(wallet: IWallet, storage: Storage, keyStoreService: KeyStoreService, password: string): Promise<MerkleTree> {
        // Retrieve the config
        return storage.get(
            MerkleTree.getConfigStorageKey(wallet)
        ).then(
            (config: IMerkleTreeConfig) => {
                if(!config)
                    return Promise.reject("MerkleTree not found on disk");

                let layerCount = config.layerCount;

                let readLayerPromise = Promise.resolve();
                let layers: string[][] = [];
                let layerKeys: string[] = MerkleTree.getLayerStorageKeys(wallet, layerCount);
                for(let i = 0; i < layerCount; i++) {
                    readLayerPromise = readLayerPromise.then(
                        () => {
                            let key = layerKeys[i];
                            return storage.get(key).then(
                                (encryptedLayer: IKeyStore) => {
                                    if(!encryptedLayer)
                                        return Promise.reject("Missing layer: " + i);

                                    // Decrypt
                                    let decryptedLayer = keyStoreService.decryptKeyStore(encryptedLayer, password);
                                    let layer = JSON.parse(decryptedLayer);

                                    layers.push(layer);
                                }
                            );
                        }
                    );
                }

                return readLayerPromise.then(
                    () => new MerkleTree(layers)
                );
            }
        );
    }

    /**
     * Gets the storage key for the config of the given wallet.
     * @param wallet 
     */
    static getConfigStorageKey(wallet: IWallet): string {
        return `${ wallet.id }-config`;
    }
    /**
     * Returns a list of storage keys for all layer of the given wallet and for the given layer count.
     */
    static getLayerStorageKeys(wallet: IWallet, layerCount: number): string[] {
        let layerKeys: string[] = [];

        for(let i = 0; i < layerCount; i++) {
            layerKeys.push(`${ wallet.id }-layer-${ i }`);
        }
        
        return layerKeys;
    }

    private static generateLayers(publicKeys: string[], layerCount: number): string[][] {
        let layers: string[][] = [];

        // Add initial layer
        layers.push(publicKeys);

        for(let i = 1; i < layerCount; i++) {
            let previousLayer = layers[i - 1];

            let newLayer: string[] = [];

            for(let j = 0; j < previousLayer.length; j += 2) {
                let left = previousLayer[j];
                let right = previousLayer[j + 1];

                newLayer.push(MerkleTree.sha256(left + right));
            }

            layers.push(newLayer);
        }

        return layers;
    }

    private static generateLeafKeys(privateKey: string, layerCount: number, platform: Platform, progressUpdate?: (progress: number) => void): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let prng = new (<any>Math).seedrandom(privateKey);

            let totalKeys = Math.pow(2, layerCount - 1);

            console.log("protocol", window.location.protocol);
            console.log("host", window.location.host);

            let scripts: string[];

            if(platform.is("android")) {
                // Android requires the scripts to be loaded as shown below.
                scripts = [
                    `file:///android_asset/www/assets/scripts/forge.min.js`,
                    `file:///android_asset/www/assets/scripts/sjcl.js`,
                    `file:///android_asset/www/assets/scripts/seedrandom.min.js`
                ];
            }
            else if(platform.is("ios")) {
                // Do we need to do anything special for iOS?
                scripts = [
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/forge.min.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/sjcl.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/seedrandom.min.js`,
                ];
            }
            else {
                // Web is easy.
                scripts = [
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/forge.min.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/sjcl.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/seedrandom.min.js`,
                ];
            }

            // Create a thread pool
            let pool = new Pool();
            pool.run(LamportGeneratorThread, scripts);

            let totalJobs = Math.ceil(totalKeys / MerkleTree.KEYS_PER_JOB);
            let totalJobsDone = 0;

            // Enqueue jobs for the thread pool
            for(let i = 0; i < totalKeys; i += MerkleTree.KEYS_PER_JOB) {
                // Determine how many keys are still left to be generated
                let keysThisIteration = Math.min(MerkleTree.KEYS_PER_JOB, totalKeys - i);

                // Generate seeds
                let seeds: Uint8Array[] = [];
                for(let j = 0; j < keysThisIteration; j++) {
                    seeds.push(MerkleTree.getRandomBytes(prng, 100));
                }

                // Prepare job input
                let jobInput: ILamportGeneratorThreadInput = {
                    startIndex: i,
                    seeds: seeds,
                    count: keysThisIteration
                };

                // Send to job queue
                pool.send(jobInput);
            }

            // Store job output here. Later we will concatenate it.
            let processedJobOutputs: ILamportGeneratorThreadOutput[] = [];

            pool.on("done", (job, message: ILamportGeneratorThreadOutput) => {
                // Store job output without processing it any further at this point
                processedJobOutputs.push(message);

                totalJobsDone++;

                if(progressUpdate) {
                    // We only count to 99% because the last 1% is used
                    // to serialize the Merkle Tree.
                    progressUpdate((totalJobsDone / totalJobs) * 0.99);
                }
            });

            pool.on("error", (job, error) => {
                // A job failed, this means the entire Merkle Tree is worthless.
                // Abort and notify calling function about the failure...
                pool.killAll();

                reject(error);
            });

            pool.on("finished", () => {
                pool.killAll();

                // Sort job outputs so public keys are in order
                processedJobOutputs.sort((a, b) => a.startIndex - b.startIndex);

                // Concatenate
                let publicKeys = processedJobOutputs.reduce<string[]>(
                    (previous, current) => previous.concat(current.publicKeys),
                    []
                );

                resolve(publicKeys);
            });
        });
    }

    private static sha256Base32(data: string): string {
        if(!this.md256)
            this.md256 = new sjcl.hash.sha256();

        this.md256.update(data, "utf8");

        let hash = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base32.fromBits(hash);
    }

    private static sha256(data: string): string {
        if(!this.md256)
            this.md256 = new sjcl.hash.sha256();

        this.md256.update(data, "utf8");

        let hash = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base64.fromBits(hash);
    }

    private static getRandomBytes(prng: any, count: number): Uint8Array {
        let randomBytes = new Uint8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(prng() * 0xFF);
        }

        return randomBytes;
    }
}