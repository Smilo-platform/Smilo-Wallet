import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { ITransactionList } from "../../models/ITransactionList";

export interface IWalletTransactionHistoryService {
    getTransactionHistory(publicKey: string): Promise<ITransactionList>
}

@Injectable()
export class WalletTransactionHistoryService implements IWalletTransactionHistoryService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    getTransactionHistory(publicKey: string, skip: number = 0, take: number = 32, isDescending: boolean = false): Promise<ITransactionList> {
        return this.http.get<ITransactionList>(
            `${ this.urlService.getBaseUrl() }/address/tx/${ publicKey }?skip=${ skip }&take=${ take }&isdescending=${ isDescending }`
        ).toPromise();
    }
}