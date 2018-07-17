import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { ITransaction } from "../../models/ITransaction";
import { ITransactionOutput } from "../../models/ITransactionOutput";
import { TransactionHelper } from "../../core/transactions/TransactionHelper";

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
  enoughFunds: boolean;
  password: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public transactionSignService: TransactionSignService) {}

  ionViewDidLoad(): void {
    this.fromWallet = this.navParams.get("currentWallet");
    this.balances = this.navParams.get("currentWalletBalance");
    for (let currency of this.balances) { // DELETE later just for testing
      let random = Math.floor(Math.random() * 9999); 
      currency.amount = random;
    }
    this.chosenCurrency = this.balances[0].currency;
    this.chosenCurrencyAmount = this.balances[0].amount;
  }

  setChosenCurrencyAmount(): boolean {
    for (let currency of this.balances) {
      if (currency.currency === this.chosenCurrency) {
        this.chosenCurrencyAmount = currency.amount;
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

  onAmountChanged(): void {
    if (this.amount.toString() === "") {
      this.enoughFunds = undefined;
    } else if (this.amount <= this.chosenCurrencyAmount) {
      this.enoughFunds = true;
    } else {
      this.enoughFunds = false;
    }
  }

  transfer(): void {
    if(this.canTransfer()) {

      this.sendTransaction();
    } 
  }

  sendTransaction(): void {
    let index = 0;
    let transactionHelper = new TransactionHelper();
    let transactionOutputs = [<ITransactionOutput>{outputAddress: this.toPublicKey, outputAmount: Number(this.amount)}]
    let transaction: ITransaction = {   
      timestamp: Math.floor(Date.now() / 1000),
      inputAddress: this.fromWallet.publicKey,
      fee: 0,
      assetId: "0",
      inputAmount: Number(this.amount),
      transactionOutputs: transactionOutputs
    }
    transaction.dataHash = transactionHelper.getDataHash(transaction);
    this.transactionSignService.sign(this.fromWallet as ILocalWallet, 
                                      this.password, 
                                      transaction, 
                                      index).then(data => {
      console.log("Transaction succes: " + data);
    }).catch(data => { 
      console.log(data);
    });
  }
}
