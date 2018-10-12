import { IMerkleTreeService } from "../../src/services/merkle-tree-service/merkle-tree-service";
import { MockMerkleTree } from "./MockMerkleTree";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export class MockMerkleTreeService implements IMerkleTreeService {
    
    generate(wallet: Smilo.IWallet, password: string, progressUpdate: (progress: number) => void): Promise<void> {
        return Promise.resolve();
    }

    get(wallet: Smilo.IWallet, password: string): Promise<Smilo.MerkleTree> {
        return Promise.resolve(new MockMerkleTree());
    }

    remove(wallet: Smilo.IWallet): Promise<void> {
        return Promise.resolve(null);
    }
}