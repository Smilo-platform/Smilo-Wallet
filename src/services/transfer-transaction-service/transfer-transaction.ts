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
        return this.http.post("", transaction).toPromise();
    }
}