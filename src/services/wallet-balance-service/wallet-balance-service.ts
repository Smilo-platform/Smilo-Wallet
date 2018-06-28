import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";

export interface IWalletBalanceService {
    getWalletBalance(publicKey: string);
}

@Injectable()
export class WalletBalanceService implements IWalletBalanceService {

    constructor(private http: HttpClient,
                private urlService: UrlService) {
        
    }

    getWalletBalance(publicKey: string): Promise<string[]> {
        return this.http.get(this.urlService.getBaseUrl() + '/balance/' + publicKey).toPromise().then(data => {
            var json = JSON.parse(JSON.stringify(data));
            return json;
        });
    }
}