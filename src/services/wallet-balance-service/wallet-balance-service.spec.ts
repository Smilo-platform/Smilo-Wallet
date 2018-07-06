import { WalletBalanceService } from "./wallet-balance-service";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { MockUrlService } from "../../../test-config/mocks/MockUrlService";
import { MockWalletBalanceService } from "../../../test-config/mocks/MockWalletBalanceService";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

describe("WalletBalanceService", () => {
    let walletBalanceService: WalletBalanceService;
    let httpClient: MockHttpClient;
    let urlService: MockUrlService;
    let mockedWalletBalanceService: MockWalletBalanceService;

    beforeEach(() => {
        httpClient = new MockHttpClient();
        urlService = new MockUrlService();
        mockedWalletBalanceService = new MockWalletBalanceService();

        walletBalanceService = new WalletBalanceService(httpClient, urlService);
    });

    it("should return a specific list of balances", (done) => {
        mockedWalletBalanceService.getWalletBalance("DOESN'T_HAVE_TO_EXIST").then(data => {
            spyOn(httpClient, "get").and.returnValue(Observable.of(data));
            walletBalanceService.getWalletBalance("DOESN'T_HAVE_TO_EXIST").then(data => {
                expect(data).toEqual(<any>{"publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "storedCoins": [
                    { "currency": "XSM", "amount": 5712 },
                    { "currency": "XSP", "amount": 234}
                ]});
                done();
            });
        });
    })

});