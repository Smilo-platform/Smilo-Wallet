import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";

export interface IWalletTransactionHistoryService {
    getTransactionHistory(publicKey: string): Promise<ITransaction[]>
}

@Injectable()
export class WalletTransactionHistoryService implements IWalletTransactionHistoryService {
    constructor(private http: HttpClient) {}

    getTransactionHistory(publicKey: string): Promise<ITransaction[]> {
        return this.http.get('assets/json/previousTransactions.json').toPromise().then(data => {
            let transactions = [];
            var json = JSON.parse(JSON.stringify(data));
            for (let i = 0; i < json.length; i++) {
                if (json[i].input === publicKey || json[i].output === publicKey) {
                    transactions.push(json[i]);
                }
            }
            return transactions;
        });
    }
}