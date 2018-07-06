import { MerkleTree } from "./MerkleTree";
import { Platform } from "ionic-angular/platform/platform";
import { MockThreadPool } from "../../test-config/mocks/MockThreadPool";
import { ILamportGeneratorThreadInput, ILamportGeneratorThreadOutput } from "./LamportGenerator";
import { MockKeyStoreService } from "../../test-config/mocks/MockKeyStoreService";
import { Storage } from "@ionic/storage";
import { IKeyStoreService } from "../services/key-store-service/key-store-service";

describe("MerkleTree", () => {
    let platformService: Platform;
    let storageService: Storage;
    let keyStoreService: IKeyStoreService;

    function generateDummyMerkleTree(layerCount: Number): MerkleTree {
        let layers: string[][] = [];

        for(let i = 0; i < layerCount; i++) {
            layers.push([]);
        }

        // Set root key
        layers[layers.length - 1][0] = "KEY";

        return new (<any>MerkleTree)(layers);
    }

    beforeEach(() => {
        platformService = new Platform();
        storageService = new Storage(null);
        keyStoreService = new MockKeyStoreService();
    });

    it("should return correct config storage keys", () => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        expect(MerkleTree.getConfigStorageKey(<any>dummyWallet)).toBe("WALLET_ID-config");
    });

    it("should return correct layer storage keys", () => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        expect(MerkleTree.getLayerStorageKeys(<any>dummyWallet, 4)).toEqual([
            "WALLET_ID-layer-0",
            "WALLET_ID-layer-1",
            "WALLET_ID-layer-2",
            "WALLET_ID-layer-3"
        ]);
    });

    it("should serialize the Merkle Tree correctly", (done) => {
        // Programmers hate this one trick! Save money now!
        let merkleTree: MerkleTree = new (<any>MerkleTree)([
            ["1", "2", "3", "4"],
            ["1", "2"],
            ["1"]
        ]);

        spyOn(keyStoreService, "createKeyStore").and.callFake((data, password) => {
            // We parse the JSON string so we can determine which layer we are working on.
            // Next we return a simple object which we can use to validate the storage.set functionality.
            let parsed = JSON.parse(data);

            switch(parsed.length) {
                case(4):
                    return {length: 4};
                case(2):
                    return {length: 2};
                case(1):
                    return {length: 1};
            }
        });
        spyOn(storageService, "set").and.callFake((key, value) => {
            // Check if the key and value match
            switch(key) {
                case("prefix-config"):
                    expect(value).toEqual({
                        layerCount: 3,
                        version: 1
                    });
                    break;
                case("prefix-layer-0"):
                    expect(value).toEqual({length: 4});
                    break;
                case("prefix-layer-1"):
                    expect(value).toEqual({length: 2});
                    break;
                case("prefix-layer-2"):
                expect(value).toEqual({length: 1});
                    break;
            }

            return Promise.resolve();
        });

        merkleTree.serialize("prefix", storageService, keyStoreService, "pass123").then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
        
    });

    it("should prefix the public keys correctly", () => {
        expect(generateDummyMerkleTree(14).getPublicKey().startsWith("S1")).toBeTruthy();
        expect(generateDummyMerkleTree(15).getPublicKey().startsWith("S2")).toBeTruthy();
        expect(generateDummyMerkleTree(16).getPublicKey().startsWith("S3")).toBeTruthy();
        expect(generateDummyMerkleTree(17).getPublicKey().startsWith("S4")).toBeTruthy();
        expect(generateDummyMerkleTree(18).getPublicKey().startsWith("S5")).toBeTruthy();
        expect(generateDummyMerkleTree(19).getPublicKey().startsWith("X1")).toBeTruthy();
        expect(generateDummyMerkleTree(13).getPublicKey().startsWith("X1")).toBeTruthy();
    });

    it("should add the correct checksum to the public keys", () => {
        // The last 4 characters of the public key are the first
        // 4 characters of the checksum of the address prefix + the pre address.
        let dummy = generateDummyMerkleTree(14);

        let publicKey = dummy.getPublicKey();

        let addressMinusChecksum = publicKey.substr(0, publicKey.length - 4);
        let checkSum = publicKey.substr(publicKey.length - 4, 4);

        let fullChecksum: string = (<any>MerkleTree).sha256Base32(addressMinusChecksum);

        expect(fullChecksum.startsWith(checkSum)).toBeTruthy();
    });

    it("should generate the Merkle Tree correctly", (done) => {
        let layers = [];

        spyOn((<any>MerkleTree), "generateLeafKeys").and.returnValue(Promise.resolve(["1", "2", "3", "4"]));
        spyOn((<any>MerkleTree), "generateLayers").and.returnValue(layers);

        MerkleTree.generate("PRIVATE_KEY", 2, platformService).then(
            (merkleTree) => {
                expect(merkleTree instanceof MerkleTree).toBeTruthy();
                expect(merkleTree.layers).toBe(layers);

                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
    });

    it("should read the Merkle Tree from disk correctly", (done) => {
        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTree, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageService, "get").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    return Promise.resolve({
                        name: "layer2"
                    });
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(keyStoreService, "decryptKeyStore").and.callFake((keyStore, password) => {
            expect(password).toBe("pass123");

            switch(keyStore.name) {
                case("layer1"):
                    return JSON.stringify(["1", "2", "3", "4"]);
                case("layer2"):
                    return JSON.stringify(["1", "2"]);
                case("layer3"):
                    return JSON.stringify(["1"]);
            }
        });

        MerkleTree.fromDisk(<any>{}, storageService, keyStoreService, "pass123").then(
            (merkleTree) => {
                expect(merkleTree instanceof MerkleTree).toBeTruthy();
                expect(merkleTree.layers).toEqual([
                    ["1", "2", "3", "4"],
                    ["1", "2"],
                    ["1"]
                ]);

                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree from disk with the wrong password", (done) => {
        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTree, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageService, "get").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    return Promise.resolve({
                        name: "layer2"
                    });
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(keyStoreService, "decryptKeyStore").and.callFake((keyStore, password) => {
            // Oops wrong password!
            return null;
        });

        MerkleTree.fromDisk(<any>{}, storageService, keyStoreService, "wrong_password").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Could not decrypt Merkle Tree");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree from disk with missing layers", (done) => {
        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTree, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageService, "get").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    // Missing layer!
                    return Promise.resolve(null);
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(keyStoreService, "decryptKeyStore").and.callFake((keyStore, password) => {
            switch(keyStore.name) {
                case("layer1"):
                    return JSON.stringify(["1", "2", "3", "4"]);
                case("layer2"):
                    return JSON.stringify(["1", "2"]);
                case("layer3"):
                    return JSON.stringify(["1"]);
            }
        });

        MerkleTree.fromDisk(<any>{}, storageService, keyStoreService, "pass123").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Missing layer: 1");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree with no config", (done) => {
        spyOn(MerkleTree, "getConfigStorageKey").and.returnValue("config");
        spyOn(storageService, "get").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    // No config found!
                    return Promise.resolve(null);
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });

        MerkleTree.fromDisk(<any>{}, storageService, keyStoreService, "pass123").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("MerkleTree not found on disk");

                done();
            }
        );
    })

    it("should generate the Merkle Tree layers correctly", () => {
        // Wrapper to make calling sha256 on Merkle Tree more pretty.
        function sha256(data: string): string {
            return (<any>MerkleTree).sha256(data);
        }

        // Input public keys
        let publicKeys: string[] = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
        ];

        // Manually construct the layers
        let expectedOutput: string[][] = [
            ["1", "2", "3", "4", "5", "6", "7", "8"]
        ];
        expectedOutput.push([
            sha256(expectedOutput[0][0] + expectedOutput[0][1]),
            sha256(expectedOutput[0][2] + expectedOutput[0][3]),
            sha256(expectedOutput[0][4] + expectedOutput[0][5]),
            sha256(expectedOutput[0][6] + expectedOutput[0][7])
        ]);
        expectedOutput.push([
            sha256(expectedOutput[1][0] + expectedOutput[1][1]),
            sha256(expectedOutput[1][2] + expectedOutput[1][3])
        ]);
        expectedOutput.push([
            sha256(expectedOutput[2][0] + expectedOutput[2][1])
        ]);

        let output = (<any>MerkleTree).generateLayers(publicKeys, 4);
        expect(output).toEqual(expectedOutput);
    });

    it("should generate the Merkle Tree leaf nodes correctly", (done) => {
        let pool = new MockThreadPool();

        // Whatever platform check is made we always simply return true
        spyOn(platformService, "is").and.returnValue(true);
        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn((<any>MerkleTree), "createThreadPool").and.returnValue(pool);

        spyOn((<any>MerkleTree), "getRandomBytes").and.callFake((prng, count) => {
            let bytes: number[] = [];

            for(let i = 0; i < count; i++) {
                bytes.push(10);
            }

            return new Uint8Array(bytes);
        });

        let jobInputs: ILamportGeneratorThreadInput[] = [];
        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            // We should never receive more than three jobs.
            // This is because each job has 100 keys and we need 256 keys.
            expect(jobInputs.length).toBeLessThan(3, "Too many jobs received");

            expect(pool.poolIsKilled).toBeFalsy("Pool should not be killed before all jobs are completed");

            // Store job input for later validation
            jobInputs.push(job);

            // Generate some public keys
            let publicKeys: string[] = [];
            for(let i = 0; i < job.count; i++) {
                publicKeys.push((i + job.startIndex).toString());
            }

            let output: ILamportGeneratorThreadOutput = {
                startIndex: job.startIndex,
                publicKeys: publicKeys
            };

            // Simulate job completion
            pool.notifyJobDoneListener({}, output);

            // All jobs completed?
            if(jobInputs.length == 3) {
                pool.notifyFinishedListener();
            }
        });

        (<any>MerkleTree).generateLeafKeys("PRIVATE_KEY", 9, platformService).then(
            (publicKeys) => {
                let expectedPublicKeys: string[] = [];
                for(let i = 0; i < 256; i++) {
                    expectedPublicKeys.push(i.toString());
                }

                expect(publicKeys).toEqual(expectedPublicKeys);

                expect(pool.poolIsKilled).toBeTruthy("Thread pool should be terminated");

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called");
            }
        );
    });

    it("should handle errors when generating the Merkle Tree leaf nodes correctly", (done) => {
        let pool = new MockThreadPool();

        // Whatever platform check is made we always simply return true
        spyOn(platformService, "is").and.returnValue(true);
        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn((<any>MerkleTree), "createThreadPool").and.returnValue(pool);

        spyOn((<any>MerkleTree), "getRandomBytes").and.callFake((prng, count) => {
            let bytes: number[] = [];

            for(let i = 0; i < count; i++) {
                bytes.push(10);
            }

            return new Uint8Array(bytes);
        });

        let jobInputs: ILamportGeneratorThreadInput[] = [];
        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            // Oh dear something went wrong!
            pool.notifyErrorListeners({}, "Some error");
        });

        (<any>MerkleTree).generateLeafKeys("PRIVATE_KEY", 9, platformService).then(
            (publicKeys) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Some error");
                expect(pool.poolIsKilled).toBeTruthy("Thread pool should be terminated");

                done();
            }
        );
    });
});