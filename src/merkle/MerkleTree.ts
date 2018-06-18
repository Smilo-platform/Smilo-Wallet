export class MerkleTree {
    
    // Constructor hidden to force the user to construct this object using static functions.
    private constructor() {

    }

    /**
     * Constructs a new Merkle Tree from the given private key.
     * 
     * Each generated private key will be encrypted using the given password. 
     * @param privateKey 
     */
    static fromPrivateKey(privateKey: string, password: string): Promise<MerkleTree> {
        return Promise.reject();
    }

    /**
     * Constructs a Merkle Tree from storage. The storage location will be searched based on the given public key.
     */
    static fromStorage(publicKey: string): Promise<MerkleTree> {
        return Promise.reject();
    }
}