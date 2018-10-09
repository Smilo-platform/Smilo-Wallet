import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { IPostTransactionResult } from "../../models/IPostTransactionResult";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface ITransferTransactionService {
    sendTransaction(transaction: Smilo.ITransaction): Promise<IPostTransactionResult>
}

@Injectable()
export class TransferTransactionService implements ITransferTransactionService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    sendTransaction(transaction: Smilo.ITransaction): Promise<IPostTransactionResult> {
        // Prepare transaction object, first clone so we do not modify the original object.
        let clonedTransaction: Smilo.ITransaction = JSON.parse(JSON.stringify(transaction));

        // Next set the fee, input amount and output amounts correctly
        clonedTransaction.fee = <any>transaction.fee.toBigIntegerString();
        clonedTransaction.inputAmount = <any>transaction.inputAmount.toBigIntegerString();
        for(let i = 0; i < transaction.transactionOutputs.length; i++) {
            let clonedOutput = clonedTransaction.transactionOutputs[i];
            let originalOutput = transaction.transactionOutputs[i];

            clonedOutput.outputAmount = <any>originalOutput.outputAmount.toBigIntegerString();
        }

        return this.http.post<IPostTransactionResult>(
            `${ this.urlService.getBaseUrl() }/tx`, 
            clonedTransaction
        ).toPromise();
    }
}