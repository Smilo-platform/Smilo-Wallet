import { Injectable } from "@angular/core";
import { IAddress } from "../../models/IAddress";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";

@Injectable()
export class AddressService {
    constructor(private httpClient: HttpClient,
                private urlService: UrlService) {

    }

    get(address: string): Promise<IAddress> {
        return this.httpClient.get<IAddress>(
            `${ this.urlService.getBaseUrl() }/address/${ address }`
        ).toPromise();
    }
}