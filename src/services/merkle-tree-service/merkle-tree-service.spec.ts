import { MerkleTreeService } from "./merkle-tree-service";
import { Platform } from "ionic-angular/platform/platform";
import { Storage } from "@ionic/storage";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

describe("MerkleTreeService", () => {
    let service: MerkleTreeService;

    let storageService: Storage;
    let platformService: Platform;

    let encryptionHelper: Smilo.EncryptionHelper;
    let builder: Smilo.MerkleTreeBuilder;
    let serializer: Smilo.MerkleTreeSerializer;

    beforeEach(() => {
        storageService = new Storage(null);
        platformService = new Platform();

        service = new MerkleTreeService(storageService);
    });

    beforeEach(() => {
        // Read some private properties :O
        encryptionHelper = (<any>service).encryptionHelper;
        builder = (<any>service).merkleTreeBuilder;
        serializer = (<any>service).merkleTreeSerializer;
    });

    it("should be initialized correctly", () => {
        // Make sure the cache dictionary is available
        expect((<any>service).cache).toBeDefined();
    });
    
    it("should start generating a Merkle Tree correctly", (done) => {
        let dummyMerkleTree = {
            serialize: () => {}
        };
        let dummyWallet = {
            id: "WALLET_ID"
        };

        spyOn(encryptionHelper, "decryptKeyStore").and.returnValue("PRIVATE_KEY");
        spyOn(builder, "generate").and.returnValue(Promise.resolve(dummyMerkleTree));
        spyOn(serializer, "serialize").and.returnValue(Promise.resolve());
        spyOn(platformService, "is").and.returnValue(true);

        service.generate(<any>dummyWallet, "pass123").then(
            () => {
                // Expect Merkle Tree to be cached
                expect((<any>service).cache).toEqual({
                    WALLET_ID: dummyMerkleTree
                });

                // Expect generate function to be called correctly
                expect(builder.generate).toHaveBeenCalledWith("PRIVATE_KEY", 14, undefined);

                // Expect Merkle Tree to be serialized
                expect(serializer.serialize).toHaveBeenCalledWith(dummyMerkleTree, dummyWallet, "pass123");

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called: " + (error.message || error.toString()));
                done();
            }
        );
    });

    it("should abort generating a Merkle Tree if the keystore password is invalid", (done) => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        spyOn(encryptionHelper, "decryptKeyStore").and.returnValue(null);
        spyOn(builder, "generate").and.returnValue(Promise.resolve(null));

        service.generate(<any>dummyWallet, "pass123").then(
            () => {
                expect(true).toBe(false, "Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Could not decrypt keystore");
                expect(builder.generate).not.toHaveBeenCalled();

                done();
            }
        );
    });

    it("should return the cached Merkle Tree if available", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        (<any>service).cache["WALLET_ID"] = dummyMerkleTree;

        spyOn(serializer, "deserialize");

        service.get(<any>dummyWallet, "pass123").then(
            (merkleTree) => {
                expect(merkleTree).toBe(<any>dummyMerkleTree);
                expect(serializer.deserialize).not.toHaveBeenCalled();

                done();
            }
        );
    });

    it("should read the Merkle Tree from disk if not cached", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        spyOn(serializer, "deserialize").and.returnValue(Promise.resolve(dummyMerkleTree));

        service.get(<any>dummyWallet, "pass123").then(
            (merkleTree) => {
                expect(merkleTree).toBe(<any>dummyMerkleTree);
                expect(serializer.deserialize).toHaveBeenCalled();

                done();
            }
        );
    });

    it("should reject the promise when a Merkle Tree was not found on disk or cache", (done) => {
        spyOn(serializer, "deserialize").and.returnValue(Promise.reject("Not found on disk"));

        let dummyWallet = {
            id: "WALLET_ID"
        };
        service.get(<any>dummyWallet, "pass123").then(
            () => {
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Not found on disk");

                done();
            }
        );
    });

    it("should remove a merkle tree correctly", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        (<any>service).cache["WALLET_ID"] = dummyMerkleTree;
        
        spyOn((<any>service).merkleTreeSerializer, "clean").and.returnValue(Promise.resolve());

        service.remove(<any>dummyWallet).then(
            () => {
                // Expect cache to be cleared
                expect((<any>service).cache).toEqual({});
                expect((<any>service).merkleTreeSerializer.clean).toHaveBeenCalledWith(dummyWallet);

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            }
        );
    });
});