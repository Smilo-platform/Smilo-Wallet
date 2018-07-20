import { AddressService } from "./address-service";
import { MockHttpClient } from "../../../test-config/mocks/MockHttpClient";
import { MockUrlService } from "../../../test-config/mocks/MockUrlService";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

describe("AddressService", () => {
    let httpClient: MockHttpClient;
    let urlService: MockUrlService;
    let service: AddressService;
    
    beforeEach(() => {
        httpClient = new MockHttpClient();
        urlService = new MockUrlService();

        service = new AddressService(httpClient, urlService);
    });

    it("should return an address correctly", (done) => {
        spyOn(httpClient, "get").and.returnValue(Observable.of({some_data: "yes"}));

        service.get("SOME_ADDRESS").then(
            (result) => {
                expect(<any>result).toEqual({some_data: "yes"});

                done();
            },
            (error) => {
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
                        "000x00123": 0
                    },
                    signatureCount: -1
                });

                done();
            },
            (error) => {
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