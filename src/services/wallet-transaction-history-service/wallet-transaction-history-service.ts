import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { ITransactionList } from "../../models/ITransactionList";
import { AssetService } from "../asset-service/asset-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface IWalletTransactionHistoryService {
    getTransactionHistory(publicKey: string): Promise<ITransactionList>
}

@Injectable()
export class WalletTransactionHistoryService implements IWalletTransactionHistoryService {
    constructor(private http: HttpClient,
                private urlService: UrlService,
                private assetService: AssetService) {}

    getTransactionHistory(publicKey: string, skip: number = 0, take: number = 32, isDescending: boolean = false): Promise<ITransactionList> {
        return this.http.get<ITransactionList>(
            `${ this.urlService.getBaseUrl() }/address/tx/${ encodeURIComponent(publicKey) }?skip=${ skip }&take=${ take }&isdescending=${ isDescending }`
        ).toPromise().then(
            (result) => {
                // Convert string big integer to true big number
                for(let transaction of result.transactions) {
                    this.prepareTransaction(transaction);
                }

                return result;
            }
        );
    }

    private prepareTransaction(transaction: Smilo.ITransaction): void {
        transaction.fee = this.assetService.prepareBigNumber(<any>transaction.fee, "000x00123");
        transaction.inputAmount = this.assetService.prepareBigNumber(<any>transaction.inputAmount, "000x00123");
        
        transaction.transactionOutputs.forEach(
            output => this.prepareTransactionOutput(transaction.assetId, output)
        );
    }
    private prepareTransactionOutput(assetId: string, transactionOutput: Smilo.ITransactionOutput): void {
        transactionOutput.outputAmount = this.assetService.prepareBigNumber(<any>transactionOutput.outputAmount, assetId);
    }
}