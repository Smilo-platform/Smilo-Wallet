import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IKeyStoreService } from "../key-store-service/key-store-service";
import { MerkleTree } from "../../core/merkle/MerkleTree";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { ITransaction } from "../../models/ITransaction";

interface ITranslationTestVector {
    /**
     * The transaction minus signature and hashed data
     */
    transaction: ITransaction;
    /**
     * The expected signature to be generated
     */
    expectedSignatureData: string;
    /**
     * The expected data before hashing
     */
    expectedHashableData: string;
    /**
     * The expected hashed data
     */
    expectedDataHash: string;
}

describe("TransactionSignService", () => {
    let service: TransactionSignService;
    let merkleTreeService: IMerkleTreeService;
    let keyStoreService: IKeyStoreService;
    let merkleTree: MerkleTree;

    let testVectors: ITranslationTestVector[] = [
        {
            transaction: {
                timestamp: 1000,
                inputAddress: "S1PY77CNJF6SJ3ROTROMBDRM7VYYUU5NBCUM3Y",
                fee: 10,
                assetId: "1",
                inputAmount: 100,
                transactionOutputs: [
                    {
                        outputAddress: "S33UFRIWSOTZDVRKAD3RFX2OYNNCDOPYMJS4RL",
                        outputAmount: 100
                    }
                ]
            },
            expectedSignatureData: "",
            expectedHashableData: "1000:1:S1PY77CNJF6SJ3ROTROMBDRM7VYYUU5NBCUM3Y:100:10:S33UFRIWSOTZDVRKAD3RFX2OYNNCDOPYMJS4RL:100",
            expectedDataHash: "6d5c0e2dc0030fbbe5169f1427eb9a276b6843abd8845bdc9bb2db1998c3e51f"
        }
    ];

    beforeEach(() => {
        // Construct service
        merkleTreeService = new MockMerkleTreeService();
        keyStoreService = new MockKeyStoreService();

        service = new TransactionSignService(<any>merkleTreeService, keyStoreService);
    });

    beforeEach(() => {
        let sjcl = (<any>window).sjcl;

        let md256 = new sjcl.hash.sha256();
        function sha256(data: string): string {
            md256.update(data, "utf8");

            let hash = md256.finalize();

            md256.reset();

            return sjcl.codec.base64.fromBits(hash);
        }

        // Construct Merkle Tree
        let merkleTreeLayers: string[][] = [];

        merkleTreeLayers[0] = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
        ];

        merkleTreeLayers[1] = [
            sha256(merkleTreeLayers[0][0] + merkleTreeLayers[0][1]),
            sha256(merkleTreeLayers[0][2] + merkleTreeLayers[0][3]),
            sha256(merkleTreeLayers[0][4] + merkleTreeLayers[0][5]),
            sha256(merkleTreeLayers[0][6] + merkleTreeLayers[0][7]),
        ];

        merkleTreeLayers[2] = [
            sha256(merkleTreeLayers[1][0] + merkleTreeLayers[1][1]),
            sha256(merkleTreeLayers[1][2] + merkleTreeLayers[1][3])
        ];

        merkleTreeLayers[3] = [
            sha256(merkleTreeLayers[2][0] + merkleTreeLayers[2][1])
        ];

        merkleTree = new (<any>MerkleTree)(merkleTreeLayers);
    });

    it("should return the correct hashable data", () => {
        for(let testVector of testVectors) {
            let hashableData = service.getHashableData(testVector.transaction);

            expect(hashableData).toBe(testVector.expectedHashableData);
        }
    });

    it("should return the correct data hash", () => {
        for(let testVector of testVectors) {
            let dataHash = service.getDataHash(testVector.transaction);

            expect(dataHash).toBe(testVector.expectedDataHash);
        }
    });
});