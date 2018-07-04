import { MerkleTreeService } from "./merkle-tree-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { Platform } from "ionic-angular/platform/platform";
import { Storage } from "@ionic/storage";
import { MerkleTree } from "../../merkle/MerkleTree";

describe("MerkleTreeService", () => {
    let service: MerkleTreeService;

    let keyStoreService: MockKeyStoreService;
    let storageService: Storage;
    let platformService: Platform;

    beforeEach(() => {
        keyStoreService = new MockKeyStoreService();
        storageService = new Storage(null);
        platformService = new Platform();

        service = new MerkleTreeService(keyStoreService, storageService, platformService);
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

        spyOn(keyStoreService, "decryptKeyStore").and.returnValue("PRIVATE_KEY");
        spyOn(MerkleTree, "generate").and.returnValue(Promise.resolve(dummyMerkleTree));
        spyOn(dummyMerkleTree, "serialize").and.returnValue(Promise.resolve());

        service.generate(<any>dummyWallet, "pass123").then(
            () => {
                // Expect Merkle Tree to be cached
                expect((<any>service).cache).toEqual({
                    WALLET_ID: dummyMerkleTree
                });

                // Expect generate function to be called correctly
                expect(MerkleTree.generate).toHaveBeenCalledWith("PRIVATE_KEY", 14, platformService, undefined);

                // Expect Merkle Tree to be serialized
                expect(dummyMerkleTree.serialize).toHaveBeenCalledWith("WALLET_ID", storageService, keyStoreService, "pass123");

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");
                done();
            }
        );
    });

    it("should abort generating a Merkle Tree if the keystore password is invalid", (done) => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        spyOn(keyStoreService, "decryptKeyStore").and.returnValue(null);
        spyOn(MerkleTree, "generate").and.returnValue(Promise.resolve(null));

        service.generate(<any>dummyWallet, "pass123").then(
            () => {
                expect(true).toBe(false, "Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(MerkleTree.generate).not.toHaveBeenCalled();

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

        spyOn(MerkleTree, "fromDisk");

        service.get(<any>dummyWallet, "pass123").then(
            (merkleTree) => {
                expect(merkleTree).toBe(<any>dummyMerkleTree);
                expect(MerkleTree.fromDisk).not.toHaveBeenCalled();

                done();
            }
        );
    });

    it("should read the Merkle Tree from disk if not cached", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        spyOn(MerkleTree, "fromDisk").and.returnValue(Promise.resolve(dummyMerkleTree));

        service.get(<any>dummyWallet, "pass123").then(
            (merkleTree) => {
                expect(merkleTree).toBe(<any>dummyMerkleTree);
                expect(MerkleTree.fromDisk).toHaveBeenCalled();

                done();
            }
        );
    });

    it("should reject the promise when a Merkle Tree was not found on disk or cache", (done) => {
        spyOn(MerkleTree, "fromDisk").and.returnValue(Promise.reject("Not found on disk"));

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

        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config-storagekey");
        spyOn(MerkleTree, "getLayerStorageKeys").and.returnValue([
            "layer1-storagekey",
            "layer2-storagekey",
            "layer3-storagekey",
            "layer4-storagekey"
        ]);

        spyOn(storageService, "get").and.callFake((key) => {
            // Only the config is requested
            return Promise.resolve({
                layerCount: 4
            });
        });

        let removedKeys: string[] = [];
        spyOn(storageService, "remove").and.callFake((key) => {
            // Store the removed key. Later we will use this
            // array to determine if everything was removed.
            removedKeys.push(key);

            return Promise.resolve();
        });

        service.remove(<any>dummyWallet).then(
            () => {
                // Sort the removed keys so we can do an equality check
                removedKeys.sort((a, b) => {
                    if(a > b)
                        return 1;
                    else if(a < b)
                        return -1;
                    else
                        return 0;
                });

                // Expect config and all layers to be removed
                expect(removedKeys).toEqual([
                    "config-storagekey",
                    "layer1-storagekey",
                    "layer2-storagekey",
                    "layer3-storagekey",
                    "layer4-storagekey"
                ]);

                // Expect cache to be cleared
                expect((<any>service).cache).toEqual({});

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            }
        );
    });

    it("should remove a merkle tree with missing layers correctly", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        (<any>service).cache["WALLET_ID"] = dummyMerkleTree;

        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config-storagekey");
        spyOn(MerkleTree, "getLayerStorageKeys").and.returnValue([
            "layer1-storagekey",
            "layer2-storagekey",
            "layer3-storagekey",
            "layer4-storagekey"
        ]);

        spyOn(storageService, "get").and.callFake((key) => {
            // Only the config is requested
            return Promise.resolve({
                layerCount: 4
            });
        });

        let removedKeys: string[] = [];
        spyOn(storageService, "remove").and.callFake((key) => {
            // Store the removed key. Later we will use this
            // array to determine if everything was removed.

            // Layer 2 and 4 are magically missing from disk :O
            if(key == "layer2-storagekey")
                return Promise.reject("Not found");
            else if(key == "layer4-storagekey")
                return Promise.reject("Not found");

            removedKeys.push(key);

            return Promise.resolve();
        });

        service.remove(<any>dummyWallet).then(
            () => {
                // Sort the removed keys so we can do an equality check
                removedKeys.sort((a, b) => {
                    if(a > b)
                        return 1;
                    else if(a < b)
                        return -1;
                    else
                        return 0;
                });

                // Expect config and all layers to be removed
                expect(removedKeys).toEqual([
                    "config-storagekey",
                    "layer1-storagekey",
                    "layer3-storagekey"
                ]);

                // Expect cache to be cleared
                expect((<any>service).cache).toEqual({});

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            }
        );
    });

    it("should abort removing a merkle tree with no config", (done) => {
        let dummyMerkleTree = {};
        let dummyWallet = {
            id: "WALLET_ID"
        };

        (<any>service).cache["WALLET_ID"] = dummyMerkleTree;

        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config-storagekey");

        spyOn(storageService, "get").and.callFake((key) => {
            // Return null because the config could not be found
            return Promise.resolve(null);
        });

        spyOn(storageService, "remove");

        service.remove(<any>dummyWallet).then(
            () => {
                // No call to remove should be made
                expect(storageService.remove).not.toHaveBeenCalled();

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            }
        );
    });
});