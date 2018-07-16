import { AddressHelper } from "../address/AddressHelper";

export class MerkleTree {
    private addressHelper = new AddressHelper();

    layers: string[][];
    
    constructor(layers: string[][]) {
        this.layers = layers;
    }

    getPublicKey(): string {
        return this.addressHelper.addressFromPublicKey(
            this.layers[this.layers.length - 1][0],
            this.layers.length
        );
    }
}