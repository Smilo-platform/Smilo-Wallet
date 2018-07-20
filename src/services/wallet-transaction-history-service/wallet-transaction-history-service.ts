import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";
import { UrlService } from "../url-service/url-service";

export interface IWalletTransactionHistoryService {
    getTransactionHistory(publicKey: string): Promise<ITransaction[]>
}

@Injectable()
export class WalletTransactionHistoryService implements IWalletTransactionHistoryService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    getTransactionHistory(publicKey: string): Promise<ITransaction[]> {
        return this.http.get<ITransaction[]>("http://localhost:8090" + "/address/tx/" + publicKey).toPromise();
    }
}