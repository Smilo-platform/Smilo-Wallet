import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { ITransaction } from "../../models/ITransaction";
import { ITransactionOutput } from "../../models/ITransactionOutput";
import { TransactionHelper } from "../../core/transactions/TransactionHelper";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { TranslateService } from "@ngx-translate/core";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";

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
  chosenCurrencyAmount: number;
  /**
   * The amount of the currency to send
   */
  amount: number;
  /**
   * The error message to show if there is any
   */
  errorMessage: string;
  /**
   * The success message to show if there is any
   */
  successMessage: string;
  /**
   * Check for enough funds on the current wallet and currency
   */
  enoughFunds: boolean;
  /**
   * The password for signing the transaction
   */
  password: string;
  /**
   * To disable and enable the transfer button in the async requests
   */
  transferButtonEnabled: boolean;
  /**
   * To show and hide the success loader animation
   */
  doneLoading: boolean;
    /**
   * List of translations set programmatically
   */
  translations: Map<string, string> = new Map<string, string>();

  constructor(private navParams: NavParams,
              private transactionSignService: TransactionSignService,
              private transferTransactionService: TransferTransactionService,
              private translateService: TranslateService,
              private bulkTranslateService: BulkTranslateService) {}

  ionViewDidLoad(): void {
    this.getAndSubscribeToTranslations();
    this.transferButtonEnabled = true;
    this.doneLoading = false;
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
    if (this.toPublicKey === undefined || this.toPublicKey === "") {
      this.errorMessage = this.translations.get("transfer.empty_public_key");
      return false;
    } else if (this.amount === undefined || this.amount.toString() === "") {
      this.errorMessage = this.translations.get("transfer.empty_amount");
      return false;
    } else if (!this.enoughFunds) {
      this.errorMessage = this.translations.get("transfer.not_enough_funds");
      return false;
    } else if (this.toPublicKey === this.fromWallet.publicKey) {
      this.errorMessage = this.translations.get("transfer.own_wallet");
      return false;
    } else if (this.password === undefined || this.password === "") {
      this.errorMessage = this.translations.get("transfer.empty_password_field");
      return false;
    } else {
      this.errorMessage = "";
      return true;
    }
  }

  resetTransferState() {
    this.doneLoading = false;
    this.errorMessage = "";
    this.successMessage = "";
  }

  onAmountChanged(): void {
    this.resetTransferState();
    if (this.amount === undefined || this.amount.toString() === "") {
      this.enoughFunds = undefined;
    } else if (this.amount <= this.chosenCurrencyAmount) {
      this.enoughFunds = true;
    } else {
      this.enoughFunds = false;
    }
  }

  transfer(): void {
    this.resetTransferState();
    this.transferButtonEnabled = false;
    if(this.canTransfer()) {
      let transaction = this.createTransaction();
      this.signTransaction(transaction).then(
        (success) => {
          this.sendTransaction(transaction);
        }
      );
    } else {
      this.transferButtonEnabled = true;
    }
  }

  createTransaction(): ITransaction {
    let transactionHelper = new TransactionHelper();
    let transactionOutputs = [<ITransactionOutput>{outputAddress: this.toPublicKey, outputAmount: Number(this.amount)}]
    let transaction: ITransaction = {
      timestamp: Math.floor(Date.now()),
      inputAddress: this.fromWallet.publicKey,
      fee: 0,
      assetId: "000x00123",
      inputAmount: Number(this.amount),
      transactionOutputs: transactionOutputs
    }
    transaction.dataHash = transactionHelper.getDataHash(transaction);
    return transaction;
  }

  signTransaction(transaction: ITransaction): Promise<void> {
    this.successMessage = this.translations.get("transfer.signing_transaction");
    return this.transactionSignService.sign(this.fromWallet as ILocalWallet, 
                                     this.password, 
                                     transaction).then(() => {
        this.successMessage = this.translations.get("transfer.signing_success");
        let index = this.balances.indexOf(this.balances.find(x => x.currency === this.chosenCurrency));
        this.balances[index].amount -= this.amount;
        this.chosenCurrencyAmount = this.balances[index].amount;
      }).catch(data => {
        this.errorMessage = this.translations.get("transfer.signing_failed");
        this.successMessage = "";
        this.transferButtonEnabled = true;
      });
  }

  sendTransaction(transaction: ITransaction): void {
    this.transferTransactionService.sendTransaction(transaction).then(() => {
        this.translateService.get("transfer.sent_success", {amount: this.amount, chosenCurrency: this.chosenCurrency, toPublicKey: this.toPublicKey}).subscribe(
          (translation) => {
            this.errorMessage = "";
            this.successMessage = translation
            this.toPublicKey = "";
            this.amount = null;
            this.enoughFunds = undefined;
            this.password = "";
            this.transferButtonEnabled = true;
            this.doneLoading = true;  
           } 
        );
    }).catch(() => {
      this.errorMessage = this.translations.get("transfer.sent_failed");
      this.successMessage = "";
      this.transferButtonEnabled = true;
    });
  }
}
