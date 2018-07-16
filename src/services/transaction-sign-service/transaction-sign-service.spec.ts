import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IKeyStoreService } from "../key-store-service/key-store-service";
import { MerkleTree } from "../../core/merkle/MerkleTree";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { ITransaction } from "../../models/ITransaction";

interface ITransactionTestVector {
    /**
     * The transaction minus signature and hashed data
     */
    transaction: ITransaction;
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

    let testVectors: ITransactionTestVector[] = [
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