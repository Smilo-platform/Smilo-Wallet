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
  fromWallet: IWallet;
  toPublicKey: string;
  balances: IBalance[];
  chosenCurrency: string;
  chosenCurrencyAmount: number;
  amount: number;
  errorMessage: string;
  successMessage: string;
  enoughFunds: boolean;
  password: string;
  transferButtonEnabled: boolean;
  doneLoading: boolean;

  constructor(private navParams: NavParams,
              private transactionSignService: TransactionSignService,
              private transferTransactionService: TransferTransactionService) {}

  ionViewDidLoad(): void {
    this.transferButtonEnabled = true;
    this.doneLoading = false;
    this.fromWallet = this.navParams.get("currentWallet");
    this.balances = this.navParams.get("currentWalletBalance");
    this.chosenCurrency = this.balances[0].currency;
    this.chosenCurrencyAmount = this.balances[0].amount;
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
    if (this.toPublicKey === undefined) {
      this.errorMessage = "The publickey to send is not defined";
      return false;
    } else if (this.amount === undefined) {
      this.errorMessage = "The amount is not defined";
      return false;
    } else if (!this.enoughFunds) {
      this.errorMessage = "Not enough funds";
      return false;
    } else if (this.toPublicKey === this.fromWallet.publicKey) {
      this.errorMessage = "Can't send to own wallet";
      return false;
    } else if (this.password === "") {
      this.errorMessage = "Password field is empty";
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
      timestamp: Math.floor(Date.now() / 1000),
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
    this.successMessage = "Signing the transaction...";
    let index = 0;
    return this.transactionSignService.sign(this.fromWallet as ILocalWallet, 
                                     this.password, 
                                     transaction, 
                                     index).then(
      (data) => {
        this.successMessage = "Successfully signed the transaction, sending to the blockchain..."; 
      },
      (error) => {
        this.errorMessage = "Could not sign the transaction. Please check your information.";
        this.successMessage = "";
        this.transferButtonEnabled = true;
      });
  }

  sendTransaction(transaction: ITransaction): void {
    this.transferTransactionService.sendTransaction(transaction).then(
      (data) => {
        this.successMessage = "Successfully sent " + this.amount + " " + this.chosenCurrency + " to " + this.toPublicKey;
        this.toPublicKey = "";
        this.amount = null;
        this.enoughFunds = undefined;
        this.password = "";
        this.transferButtonEnabled = true;
        this.doneLoading = true;
      (error) => {
        this.errorMessage = "Couldn't send your transaction to the blockchain, please try again later...";
        this.successMessage = "";
        this.transferButtonEnabled = true;
      }
    });
  }
}
