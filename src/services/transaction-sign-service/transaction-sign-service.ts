import { Injectable } from "@angular/core";
import { ITransaction } from "../../models/ITransaction";

export interface ITransactionSignService {
    sign(transaction: ITransaction, privateKey: string, index: number): Promise<string>;
}

@Injectable()
export class TransactionSignService implements ITransactionSignService {
    sign(transaction: ITransaction, privateKey: string, index: number): Promise<string> {
        throw new Error("Method not implemented.");
    }

}