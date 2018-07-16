import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { MerkleTree } from "../../core/merkle/MerkleTree";
import { KeyStoreService } from "../key-store-service/key-store-service";
import { Storage } from "@ionic/storage";
import { ILocalWallet } from "../../models/ILocalWallet";
import { Platform } from "ionic-angular/platform/platform";
import { MerkleTreeBuilder } from "../../core/merkle/MerkleTreeBuilder";
import { MerkleTreeSerializer } from "../../core/merkle/MerkleTreeSerializer";
import { MerkleTreeDeserializer } from "../../core/merkle/MerkleTreeDeserializer";
import { IMerkleTreeConfig } from "../../core/merkle/IMerkleTreeConfig";
import { MerkleTreeHelper } from "../../core/merkle/MerkleTreeHelper";

export interface IMerkleTreeService {
    generate(wallet: IWallet, password: string, progressUpdate?: (progress: number) => void): Promise<void>;

    get(wallet: IWallet, password: string): Promise<MerkleTree>;

    remove(wallet: IWallet): Promise<void>;
}

@Injectable()
export class MerkleTreeService implements IMerkleTreeService {
    private cache: {[index: string]: MerkleTree} = {};

    private merkleTreeBuilder = new MerkleTreeBuilder();
    private merkleTreeSerializer = new MerkleTreeSerializer();
    private merkleTreeDeserializer = new MerkleTreeDeserializer();

    constructor(private keyStoreService: KeyStoreService,
                private storage: Storage,
                private platform: Platform) {
        
    }

    generate(wallet: ILocalWallet, password: string, progressUpdate?: (progress: number) => void): Promise<void> {
        // Decrypt private key
        let privateKey = this.keyStoreService.decryptKeyStore(wallet.keyStore, password);
        if(!privateKey)
            return Promise.reject("Could not decrypt keystore");

        // Start generating the Merkle Tree
        return this.merkleTreeBuilder.generate(privateKey, 14, this.platform.is("android"), progressUpdate).then(
            (merkleTree) => {
                // Cache Merkle Tree
                this.cache[wallet.id] = merkleTree;
                
                // Store Merkle Tree on disk
                return this.merkleTreeSerializer.serialize(merkleTree, wallet, this.storage, this.keyStoreService, password);
            }
        );
    }
    
    get(wallet: IWallet, password: string): Promise<MerkleTree> {
        // In cache?
        if(this.cache[wallet.id]) {
            return Promise.resolve(this.cache[wallet.id]);
        }
        else {
            // Read from disk and then cache
            return this.merkleTreeDeserializer.fromDisk(wallet, this.storage, this.keyStoreService, password).then(
                (merkleTree) => {
                    this.cache[wallet.id] = merkleTree;

                    return merkleTree;
                }
            );
        }
    }

    remove(wallet: IWallet): Promise<void> {
        // Remove from cache
        delete this.cache[wallet.id];

        // Remove from disk
        return this.storage.get(MerkleTreeHelper.getConfigStorageKey(wallet)).then(
            (config: IMerkleTreeConfig) => {
                if(!config)
                    return Promise.resolve();

                let layerKeys = MerkleTreeHelper.getLayerStorageKeys(wallet, config.layerCount);

                let promises: Promise<void>[] = [];

                for(let layerKey of layerKeys) {
                    promises.push(
                        this.storage.remove(layerKey).then(
                            () => {
                                // Layer removed
                            },
                            (error) => {
                                // Failed to remove layer.
                                // We silently ignore this error...
                                console.error(error);
                            }
                        )
                    );
                }

                // Finaly remove the config
                promises.push(
                    this.storage.remove(MerkleTreeHelper.getConfigStorageKey(wallet))
                );

                return Promise.all(promises).then<void>();
            }
        );
    }
}