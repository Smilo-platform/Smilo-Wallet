import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { ITransaction } from "../../models/ITransaction";
import { TransactionHelper } from "../../core/transactions/TransactionHelper";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { TranslateService } from "@ngx-translate/core";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import Big from "big.js";

/**
 * Generated class for the TransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: "page-transfer",
    templateUrl: "transfer.html",
})
export class TransferPage {
    /**
     * The wallet to transfer from
     */
    fromWallet: IWallet;
    /**
     * The public key (address) to transfer to
     */
    toPublicKey: string;
    /**
     * The balances of the current wallet
     */
    balances: IBalance[];
    /**
     * The currency to send
     */
    chosenCurrency: string;
    /**
     * The amount of the chosen currency
     */
    chosenCurrencyAmount: Big;
    /**
     * The amount of the currency to send
     */
    amount: string;
    /**
     * The error message to show if there is any
     */
    errorMessage: string;
    /**
     * The status message to show if there is any
     */
    statusMessage: string;
    /**
     * Check for enough funds on the current wallet and currency
     */
    enoughFunds: boolean;
    /**
     * The password for signing the transaction
     */
    password: string;
    /**
     * True if a transfer is currently in process.
     */
    isTransferring: boolean;
    /**
   * List of translations set programmatically
   */
    translations: Map<string, string> = new Map<string, string>();

    constructor(private navParams: NavParams,
        private transactionSignService: TransactionSignService,
        private transferTransactionService: TransferTransactionService,
        private translateService: TranslateService,
        private bulkTranslateService: BulkTranslateService) { }

    ionViewDidLoad(): void {
        this.getAndSubscribeToTranslations();

        this.isTransferring = false;
        this.fromWallet = this.navParams.get("currentWallet");
        this.balances = this.navParams.get("currentWalletBalance");
        this.chosenCurrency = this.balances[0].currency;
        this.chosenCurrencyAmount = this.balances[0].amount;
    }

    getAndSubscribeToTranslations(): void {
        this.translateService.onLangChange.subscribe(data => {
            this.retrieveTranslations();
        });
        this.retrieveTranslations();
    }

    /**
   * Gets the translations to set programmatically
   */
    retrieveTranslations(): Promise<Map<string, string>> {
        return this.bulkTranslateService.getTranslations([
            "transfer.empty_public_key",
            "transfer.empty_amount",
            "transfer.not_enough_funds",
            "transfer.own_wallet",
            "transfer.empty_password_field",
            "transfer.signing_transaction",
            "transfer.signing_success",
            "transfer.signing_failed",
            "transfer.sent_success",
            "transfer.sent_failed"
        ]).then(data => {
            this.translations = data;
            return data;
        });
    }

    setChosenCurrencyAmount(): boolean {
        for (let currency of this.balances) {
            if (currency.currency === this.chosenCurrency) {
                this.chosenCurrencyAmount = currency.amount;
                this.onAmountChanged();
                return true;
            }
        }
        return false;
    }

    canTransfer(): boolean {
        // Check if public key is set
        if (!this.toPublicKey || this.toPublicKey === "") {
            return false;
        }

        // Check if amount is set
        if (!this.amount || this.amount.toString() === "") {
            return false;
        } 

        // Check if user has enough funds
        if (!this.enoughFunds) {
            return false;
        } 

        // Make sure we are not sending to our own wallet
        if (this.toPublicKey === this.fromWallet.publicKey) {
            return false;
        } 

        // Make sure password has been entered
        if (this.password === undefined || this.password === "") {
            return false;
        } 
        
        return true;
    }

    resetTransferState() {
        this.isTransferring = false;
        this.errorMessage = "";
        this.statusMessage = "";
    }

    onAmountChanged(): void {
        this.resetTransferState();

        if (this.amount === undefined || this.amount.toString() === "") {
            this.enoughFunds = undefined;
        } 
        else if (Big(this.amount).lte(this.chosenCurrencyAmount)) {
            this.enoughFunds = true;
        } 
        else {
            this.enoughFunds = false;
        }
    }

    transfer(): void {
        this.resetTransferState();
        
        this.isTransferring = true;
        this.statusMessage = this.translations.get("transfer.signing_transaction");

        let transaction = this.createTransaction();

        this.signTransaction(transaction).then(
            () => this.transferTransactionService.sendTransaction(transaction)
        ).then(
            () => {
                // Transaction send!
                this.translateService.get("transfer.sent_success", { amount: this.amount, chosenCurrency: this.chosenCurrency, toPublicKey: this.toPublicKey }).subscribe(
                    (translation) => {
                        // Status message should notify user of success
                        this.statusMessage = translation

                        // Reset input forms
                        this.toPublicKey = "";
                        this.amount = null;
                        this.enoughFunds = undefined;
                        this.password = "";

                        let index = this.balances.indexOf(this.balances.find(x => x.currency === this.chosenCurrency));
                        this.balances[index].amount = this.balances[index].amount.sub(this.amount);
                        this.chosenCurrencyAmount = this.balances[index].amount;
                    }
                );
            },
            (error) => {
                // Something went wrong!
                console.error(error);
                this.errorMessage = this.translations.get("transfer.signing_failed");
                this.statusMessage = "";
            }
        ).then(
            () => {
                // We are no longer transferring
                this.isTransferring = false;
            }
        )
    }

    createTransaction(): ITransaction {
        let transactionHelper = new TransactionHelper();

        let transaction: ITransaction = {
            timestamp: new Date().getTime(),
            inputAddress: this.fromWallet.publicKey,
            fee: Big(0),
            assetId: "000x00123",
            inputAmount: Big(this.amount),
            transactionOutputs: [
                { 
                    outputAddress: this.toPublicKey, 
                    outputAmount: Big(this.amount) 
                }
            ]
        }
        transaction.dataHash = transactionHelper.getDataHash(transaction);

        return transaction;
    }

    signTransaction(transaction: ITransaction): Promise<void> {
        return this.transactionSignService.sign(
            this.fromWallet as ILocalWallet,
            this.password,
            transaction
        );
    }
}
