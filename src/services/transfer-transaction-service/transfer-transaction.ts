import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";
import { UrlService } from "../url-service/url-service";
import { IPostTransactionResult } from "../../models/IPostTransactionResult";

export interface ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<IPostTransactionResult>
}

@Injectable()
export class TransferTransactionService implements ITransferTransactionService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    sendTransaction(transaction: ITransaction): Promise<IPostTransactionResult> {
        return this.http.post<IPostTransactionResult>(
            `${ this.urlService.getBaseUrl() }/tx`, 
            transaction
        ).toPromise();
    }
}