import { MerkleTree } from "../../src/core/merkle/MerkleTree";

export class MockMerkleTree extends MerkleTree {
    constructor() {
        super([]);
    }
}