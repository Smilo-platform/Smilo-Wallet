import { MerkleTree } from "../../src/merkle/MerkleTree";

export class MockMerkleTree extends MerkleTree {
    constructor() {
        super([]);
    }
}