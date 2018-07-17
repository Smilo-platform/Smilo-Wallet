import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";

export interface ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<Object>
}

@Injectable()
export class TransferTransactionService implements ITransferTransactionService {
    constructor(private http: HttpClient) {}

    sendTransaction(transaction: ITransaction): Promise<Object> {
        let body = {transaction: transaction};
        return this.http.post("", body).toPromise();
    }
}