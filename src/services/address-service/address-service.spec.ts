import { AddressService } from "./address-service";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { MockUrlService } from "../../../test-config/mocks/MockUrlService";
import { MockAssetService } from "../../../test-config/mocks/MockAssetService";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";

describe("AddressService", () => {
    let httpClient: MockHttpClient;
    let urlService: MockUrlService;
    let assetService: MockAssetService;
    let service: AddressService;
    
    beforeEach(() => {
        httpClient = new MockHttpClient();
        urlService = new MockUrlService();
        assetService = new MockAssetService();

        service = new AddressService(httpClient, urlService, <any>assetService);
    });

    it("should return an address correctly", (done) => {
        spyOn(httpClient, "get").and.returnValue(Observable.of({some_data: "yes"}));

        service.get("SOME_ADDRESS").then(
            (result) => {
                expect(<any>result).toEqual({some_data: "yes"});

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy("Promise reject should never be called");
                done();
            }
        );
    });

    it("should return an empty address when a 404 was returned", (done) => {
        spyOn(httpClient, "get").and.returnValue(Observable.throw({status: 404}));

        service.get("SOME_ADDRESS").then(
            (address) => {
                expect(address).toEqual({
                    publickey: "SOME_ADDRESS",
                    balances: {
                        "000x00123": new FixedBigNumber(0, 0)
                    },
                    signatureCount: -1
                });

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy("Promise reject should never be called");
                done();
            }
        );
    });

    it("should return an error when the status code is not 200 and not 404", (done) => {
        spyOn(httpClient, "get").and.returnValue(Observable.throw({status: 500}));

        service.get("SOME_ADDRESS").then(
            (address) => {
                expect(true).toBeFalsy("Promise resolve should never be called");
                done();
            },
            (error) => {
                expect(error).toEqual({status: 500});
                done();
            }
        );
    });
});