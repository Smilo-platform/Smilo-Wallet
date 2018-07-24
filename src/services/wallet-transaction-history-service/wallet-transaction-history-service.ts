import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";
import { UrlService } from "../url-service/url-service";
import { ITransactionList } from "../../models/ITransactionList";

export interface IWalletTransactionHistoryService {
    getTransactionHistory(publicKey: string): Promise<ITransactionList>
}

@Injectable()
export class WalletTransactionHistoryService implements IWalletTransactionHistoryService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    getTransactionHistory(publicKey: string): Promise<ITransactionList> {
        return this.http.get<ITransactionList>(this.urlService.getBaseUrl() + "/address/tx/" + publicKey).toPromise();
    }
}