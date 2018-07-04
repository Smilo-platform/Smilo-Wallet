import { MerkleTree } from "./MerkleTree";
import { Platform } from "ionic-angular/platform/platform";
import { MockPool } from "../../test-config/mocks/MockPool";

describe("MerkleTree", () => {
    let platformService;

    beforeEach(() => {
        platformService = new Platform();
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

    it("should generate a Merkle Tree correctly", (done) => {
        let pool: any = new MockPool();

        spyOn(platformService, "is").and.returnValue(true);
        spyOn((<any>MerkleTree), "createThreadPool").and.returnValue(pool);

        spyOn(pool, "run");
        spyOn(pool, "send");


        MerkleTree.generate("PRIVATE_KEY", 4, platformService).then(
            (merkleTree) => {
                expect(merkleTree instanceof MerkleTree).toBeTruthy();

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBe(false, "Promise reject should never be called");

                done();
            }
        );
    });
});