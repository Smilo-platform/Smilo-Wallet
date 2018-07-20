import { Injectable } from "@angular/core";
import { IAddress } from "../../models/IAddress";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";

@Injectable()
export class AddressService {
    constructor(private httpClient: HttpClient,
                private urlService: UrlService) {

    }

    get(address: string): Promise<IAddress> {
        return this.httpClient.get<IAddress>(
            `${ this.urlService.getBaseUrl() }/address/${ address }`
        ).toPromise().then<IAddress>(
            (address) => address,
            (error: HttpErrorResponse) => {
                if(error.status == 404) {
                    // 404 are expected when the address does not exist.
                    // This is not a true error, we simply return an empty wallet object.
                    let emptyAddress: IAddress = {
                        publickey: address,
                        balances: {
                            "000x00123": 0
                        },
                        signatureCount: -1
                    }

                    return emptyAddress;
                }
                else {
                    // All other status codes are true errors
                    return <any>Promise.reject(error);
                }
            }
        );
    }
}