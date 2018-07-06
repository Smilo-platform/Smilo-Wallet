import { WalletTransactionHistoryService } from "./wallet-transaction-history-service";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { MockWalletTransactionHistoryService } from "../../../test-config/mocks/MockWalletTransactionHistoryService";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

describe("WalletTransactionHistoryService", () => {
    let walletTransactionHistoryService: WalletTransactionHistoryService;
    let httpClient: MockHttpClient;
    let mockedWalletTransactionHistoryService: MockWalletTransactionHistoryService;

    beforeEach(() => {
        httpClient = new MockHttpClient();
        mockedWalletTransactionHistoryService = new MockWalletTransactionHistoryService();
        walletTransactionHistoryService = new WalletTransactionHistoryService(httpClient);
    });

    it("should return a specific set of transactions", (done) => {
        mockedWalletTransactionHistoryService.getTransactionHistory("DOESN'T_HAVE_TO_EXIST").then(data => {
            spyOn(httpClient, "get").and.returnValue(Observable.of(data));
            walletTransactionHistoryService.getTransactionHistory("ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ").then(data => {
                expect(data).toEqual([
                    { "date": "Jun 14, 2018 18:01:44 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "17srYd7sVwKgE5ha7ZXSBxUACjm2hMVQeH", "amount": "55", "currency": "XSM"},
                    { "date": "Jun 13, 2018 19:14:34 PM", "input": "1KkPiyNvRHsWC67KgK6AFHMWoxmcGm5d1H", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "292", "currency": "XSP"},
                    { "date": "Jun 08, 2018 15:44:36 PM", "input": "1LtqTERxw4QFLCbfLgB43P1XGAWUNmk6DA", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "122", "currency": "XSM"},
                    { "date": "May 28, 2018 17:22:53 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "1AvAvNh6PjzN9jjhUNhT5DuzMPgnhM6R2u", "amount": "254", "currency": "XSM"},
                    { "date": "May 26, 2018 23:44:51 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "13QMZULQGBodKzsAF462Dh2opf8PQawYBt", "amount": "5192", "currency": "XSP"},
                ]);
                done();
            });
        });
    })
});