import { Injectable } from "@angular/core";
import { IAddress } from "../../models/IAddress";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { AssetService } from "../asset-service/asset-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface IAddressService {
    get(address: string): Promise<IAddress>;
}

@Injectable()
export class AddressService implements IAddressService {
    constructor(private httpClient: HttpClient,
                private urlService: UrlService,
                private assetService: AssetService) {

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
                            "0x000000536d696c6f": new Smilo.FixedBigNumber(0, 0)
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
        ).then(
            (address) => {
                // Convert any string to big decimals
                let promises: Promise<void>[] = [];
                
                for(let assetId in address.balances) {
                    address.balances[assetId] = this.assetService.prepareBigNumber(
                        address.balances[assetId],
                        assetId
                    );
                }

                return Promise.all(promises).then(
                    () => address
                );
            }
        );
    }
}