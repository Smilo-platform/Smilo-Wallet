import { ExchangesService } from "./exchanges-service";
import { TranslateService } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { MockExchangesService } from "../../../test-config/mocks/MockExchangesSevice";
import { Observable } from "rxjs/Observable";

describe("ExchangesService", () => {
    let service: ExchangesService;
    let httpClient: MockHttpClient;
    let mockedExchangesService: MockExchangesService;

    beforeEach(() => {
        httpClient = new MockHttpClient();
        service = new ExchangesService(httpClient);
        mockedExchangesService = new MockExchangesService();
    });

    it("should return a specific list of available exchanges", (done) => {
        mockedExchangesService.getAvailableExchanges().then(data => {
            spyOn(httpClient, "get").and.returnValue(Observable.of(data));
            service.getAvailableExchanges().then(data => {
                expect(data).toEqual(<any>{"availableExchanges": [
                    {"exchange": "Bitmex", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]},
                    {"exchange": "GDAX", "availableCurrencies": ["USD", "BTC", "XSM"]},
                    {"exchange": "CexIO", "availableCurrencies": ["USD", "XSM"]},
                    {"exchange": "Kraken", "availableCurrencies": ["USD", "XSM"]},
                    {"exchange": "Coinbase", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]}
                ]});
                done();
            });
        });
    });

    it("should return a specific list of prices of only the given exchange", (done) => {
        mockedExchangesService.getPrices("currency", "GDAX").then(data => {
            spyOn(httpClient, "get").and.returnValue(Observable.of(data));
            service.getPrices("currency", "GDAX").then(data => {
                expect(data).toEqual([
                    {"exchange": "GDAX", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.30},
                    {"exchange": "GDAX", "currencyFrom": "XSM", "currencyTo": "BTC", "value": 0.00033},
                    {"exchange": "GDAX", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.33}
                ]);
                done();
            });
        });
    });
    
    it("should return an emtpy array when the given exchange doesn't exist", (done) => {
        mockedExchangesService.getPrices("currency", "I DON'T EXIST!").then(data => {
            spyOn(httpClient, "get").and.returnValue(Observable.of(data));
            service.getPrices("currency", "I DON'T EXIST!").then(data => {
                expect(data).toEqual([]);
                done();
            });
        });
    })

});