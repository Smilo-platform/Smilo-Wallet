import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { ITransactionList } from "../../models/ITransactionList";
import { ITransaction } from "../../models/ITransaction";
import { ITransactionOutput } from "../../models/ITransactionOutput";
import { AssetService } from "../asset-service/asset-service";

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
            `${ this.urlService.getBaseUrl() }/address/tx/${ publicKey }?skip=${ skip }&take=${ take }&isdescending=${ isDescending }`
        ).toPromise().then(
            (result) => {
                // Convert string big integer to true big number
                let promises: Promise<void>[] = [];

                for(let transaction of result.transactions) {
                    promises.push(this.prepareTransaction(transaction));
                }

                return Promise.all(promises).then(
                    () => result
                );
            }
        );
    }

    private prepareTransaction(transaction: ITransaction): Promise<void> {
        let promises: Promise<void>[] = [
            this.assetService.prepareBigNumber(<any>transaction.fee, "000x00123").then(
                (big) => {
                    transaction.fee = big;
                }
            ),
            this.assetService.prepareBigNumber(<any>transaction.inputAmount, transaction.assetId).then(
                (big) => {
                    transaction.inputAmount = big;
                }
            )
        ];
        
        transaction.transactionOutputs.forEach(
            output => promises.push(this.prepareTransactionOutput(transaction.assetId, output))
        );

        return Promise.all(promises).then<void>();
    }
    private prepareTransactionOutput(assetId: string, transactionOutput: ITransactionOutput): Promise<void> {
        return this.assetService.prepareBigNumber(<any>transactionOutput.outputAmount, assetId).then(
            (big) => {
                transactionOutput.outputAmount = big;
            }
        );
    }
}