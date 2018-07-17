import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITransaction } from "../../models/ITransaction";
import { UrlService } from "../url-service/url-service";

export interface ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<ITransaction>
}

@Injectable()
export class TransferTransactionService implements ITransferTransactionService {
    constructor(private http: HttpClient,
                private urlService: UrlService) {}

    sendTransaction(transaction: ITransaction): Promise<ITransaction> {
        return this.http.post<ITransaction>(
            `${ this.urlService.getBaseUrl() }/transaction`, 
            transaction
        ).toPromise();
    }
}