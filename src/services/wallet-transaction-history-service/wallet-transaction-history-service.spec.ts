import { WalletTransactionHistoryService } from "./wallet-transaction-history-service";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { UrlService } from "../url-service/url-service";
import { ITransactionList } from "../../models/ITransactionList";
import { MockAssetService } from "../../../test-config/mocks/MockAssetService";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

describe("WalletTransactionHistoryService", () => {
    let walletTransactionHistoryService: WalletTransactionHistoryService;
    let httpClient: MockHttpClient;
    let urlService: UrlService;
    let assetService: MockAssetService;

    beforeEach(() => {
        httpClient = new MockHttpClient();
        urlService = new UrlService();
        assetService = new MockAssetService();

        walletTransactionHistoryService = new WalletTransactionHistoryService(httpClient, urlService, <any>assetService);
    });

    it("should return a specific set of transactions", (done) => {
        let mockedData: ITransactionList = {
            transactions: [
                createDummyTransaction(),
                createDummyTransaction(),
                createDummyTransaction(),
                createDummyTransaction()
            ],
            skip: 0,
            take: 32,
            totalCount: 4
        };

        spyOn(httpClient, "get").and.returnValue(Observable.of(mockedData));

        walletTransactionHistoryService.getTransactionHistory("ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ").then(
            (data) => {
                expect(data).toEqual(mockedData);
                done();
            },
            (error) => {
                expect(true).toBeFalsy(error);
            }
        );
    });

    function createDummyTransaction(): Smilo.ITransaction {
        let transaction: Smilo.ITransaction = {
            timestamp: 1000,
            inputAddress: "InputAddress",
            fee: new Smilo.FixedBigNumber(0, 0),
            signatureData: "Signature",
            signatureIndex: 0,
            dataHash: "Hash",
            assetId: "AssetId",
            inputAmount: new Smilo.FixedBigNumber(100, 0),
            transactionOutputs: [
                {
                    outputAddress: "OutputAddress",
                    outputAmount: new Smilo.FixedBigNumber(100, 0)
                }
            ]
        };

        return transaction;
    }
});