import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";
import { IonicStorage } from "../../core/storage/IonicStorage";

export interface IMerkleTreeService {
    generate(wallet: Smilo.IWallet, password: string, progressUpdate?: (progress: number) => void): Promise<void>;

    get(wallet: Smilo.IWallet, password: string): Promise<Smilo.MerkleTree>;

    remove(wallet: Smilo.IWallet): Promise<void>;
}

@Injectable()
export class MerkleTreeService implements IMerkleTreeService {
    private cache: {[index: string]: Smilo.MerkleTree} = {};

    private merkleTreeBuilder = new Smilo.MerkleTreeBuilder();
    private merkleTreeSerializer: Smilo.MerkleTreeSerializer;
    private encryptionHelper = new Smilo.EncryptionHelper();

    constructor(private storage: Storage) {
        let storageManager = new IonicStorage(this.storage);

        this.merkleTreeSerializer = new Smilo.MerkleTreeSerializer(storageManager);
    }

    generate(wallet: Smilo.ILocalWallet, password: string, progressUpdate?: (progress: number) => void): Promise<void> {
        // Decrypt private key
        let privateKey = this.encryptionHelper.decryptKeyStore(wallet.keyStore, password);
        if(!privateKey)
            return Promise.reject("Could not decrypt keystore");

        // Start generating the Merkle Tree
        return this.merkleTreeBuilder.generate(privateKey, 14, progressUpdate).then(
            (merkleTree) => {
                // Cache Merkle Tree
                this.cache[wallet.id] = merkleTree;
                
                // Store Merkle Tree on disk
                return this.merkleTreeSerializer.serialize(merkleTree, wallet, password);
            }
        );
    }
    
    get(wallet: Smilo.ILocalWallet, password: string): Promise<Smilo.MerkleTree> {
        // In cache?
        if(this.cache[wallet.id]) {
            return Promise.resolve(this.cache[wallet.id]);
        }
        else {
            // Read from disk and then cache
            return this.merkleTreeSerializer.deserialize(wallet, password).then(
                (merkleTree) => {
                    this.cache[wallet.id] = merkleTree;

                    return merkleTree;
                }
            );
        }
    }

    remove(wallet: Smilo.ILocalWallet): Promise<void> {
        // Remove from cache
        delete this.cache[wallet.id];

        return this.merkleTreeSerializer.clean(wallet);
    }
}