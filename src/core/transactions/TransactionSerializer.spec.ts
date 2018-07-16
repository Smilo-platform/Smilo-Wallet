import { TransactionSerializer } from "./TransactionSerializer";
import { ITransaction } from "../../models/ITransaction";

interface ITranslationSerializerTestVector {
    transaction: ITransaction;
    expectedOutput: string;
}

describe("TransactionSerializer", () => {
    let serializer: TransactionSerializer;

    let testVectors: ITranslationSerializerTestVector[] = [
        {
            transaction: {
                timestamp: 0,
                inputAddress: "inputAddress1",
                fee: 10,
                dataHash: "dataHash1",
                assetId: "assetId1",
                inputAmount: 100,
                transactionOutputs: [
                    {
                        outputAddress: "outputAddress1",
                        outputAmount: 100
                    }
                ]
            },
            expectedOutput: `0:inputAddress1:10:dataHash1:assetId1:100`
        },
        {
            transaction: {
                timestamp: 1000,
                inputAddress: "inputAddress2",
                fee: 100,
                dataHash: "dataHash2",
                assetId: "assetId2",
                inputAmount: 1000,
                transactionOutputs: [
                    {
                        outputAddress: "outputAddress1",
                        outputAmount: 1000
                    }
                ]
            },
            expectedOutput: `1000:inputAddress2:100:dataHash2:assetId2:1000`
        }
    ]

    beforeEach(() => {
        serializer = new TransactionSerializer();
    })
    
    it("should serialize a transaction correctly", () => {
        for(let testVector of testVectors) {
            expect(serializer.transactionToString(testVector.transaction)).toEqual(testVector.expectedOutput);
        }
    });
});