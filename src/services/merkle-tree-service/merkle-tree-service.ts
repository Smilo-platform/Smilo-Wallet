import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { MerkleTree, IMerkleTreeConfig } from "../../merkle/MerkleTree";
import { KeyStoreService } from "../key-store-service/key-store-service";
import { Storage } from "@ionic/storage";
import { ILocalWallet } from "../../models/ILocalWallet";
import { Platform } from "ionic-angular/platform/platform";

export interface IMerkleTreeService {
    generate(wallet: IWallet, password: string, progressUpdate?: (progress: number) => void): Promise<void>;

    get(wallet: IWallet, password: string): Promise<MerkleTree>;

    remove(wallet: IWallet): Promise<void>;
}

/**
 * Cache storage for Merkle Trees. We moved this outside of the class declaration
 * to make it truly private.
 */
let merkleTreeCache: {[index: string]: MerkleTree} = {};

@Injectable()
export class MerkleTreeService implements IMerkleTreeService {
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
        return MerkleTree.generate(privateKey, 14, this.platform, progressUpdate).then(
            (merkleTree) => {
                // Cache Merkle Tree
                merkleTreeCache[wallet.id] = merkleTree;
                
                // Store Merkle Tree on disk
                return merkleTree.serialize(wallet.id, this.storage, this.keyStoreService, password);
            }
        );
    }
    
    get(wallet: IWallet, password: string): Promise<MerkleTree> {
        // In cache?
        if(merkleTreeCache[wallet.id]) {
            return Promise.resolve(merkleTreeCache[wallet.id]);
        }
        else {
            // Read from disk and then cache
            return MerkleTree.fromDisk(wallet, this.storage, this.keyStoreService, password).then(
                (merkleTree) => {
                    merkleTreeCache[wallet.id] = merkleTree;

                    return merkleTree;
                }
            );
        }
    }

    remove(wallet: IWallet): Promise<void> {
        // Remove from cache
        delete merkleTreeCache[wallet.id];

        // Remove from disk
        return this.storage.get(MerkleTree.getConfigStorageKey(wallet)).then(
            (config: IMerkleTreeConfig) => {
                if(!config)
                    return Promise.resolve();

                let layerKeys = MerkleTree.getLayerStorageKeys(wallet, config.layerCount);

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
                    this.storage.remove(MerkleTree.getConfigStorageKey(wallet))
                );

                return Promise.all(promises).then<void>();
            }
        );
    }
}