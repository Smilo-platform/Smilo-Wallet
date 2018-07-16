import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";

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
  amount: number;
  errorMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad(): void {
    this.fromWallet = this.navParams.get("currentWallet");
    this.balances = this.navParams.get("currentWalletBalance");
    this.chosenCurrency = this.balances[0].currency;
    for (let currency of this.balances) { // DELETE later just for testing
      let random = Math.floor(Math.random() * 9999); 
      currency.amount = random;
    }
  }

  canTransfer(): boolean {
    if (this.toPublicKey === undefined) {
      this.errorMessage = "The publickey to send is not defined";
      return false;
    } else if (this.amount === undefined) {
      this.errorMessage = "The amount is not defined";
      return false;
    } else {
      this.errorMessage = "";
      return true;
    }
  }

  transfer(): Promise<void> {
    if(this.canTransfer()) {
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
}
