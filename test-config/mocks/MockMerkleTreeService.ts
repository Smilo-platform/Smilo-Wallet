import { IMerkleTreeService } from "../../src/services/merkle-tree-service/merkle-tree-service";
import { IWallet } from "../../src/models/IWallet";
import { MerkleTree } from "../../src/merkle/MerkleTree";
import { MockMerkleTree } from "./MockMerkleTree";

export class MockMerkleTreeService implements IMerkleTreeService {
    generate(wallet: IWallet, password: string, progressUpdate: (progress: number) => void): Promise<void> {
        return Promise.resolve();
    }

    get(wallet: IWallet, password: string): Promise<MerkleTree> {
        return Promise.resolve(new MockMerkleTree());
    }

    remove(wallet: IWallet): Promise<void> {
        return Promise.resolve(null);
    }
}