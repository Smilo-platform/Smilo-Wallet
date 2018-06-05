import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletNewPassphrasePage } from "../wallet-new-passphrase/wallet-new-passphrase";

declare type WarningState = "first" | "second";

@IonicPage()
@Component({
  selector: "page-wallet-new",
  templateUrl: "wallet-new.html",
})
export class WalletNewPage {

  warningState: WarningState = "first";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToPassphrasePage() {
    this.navCtrl.push(WalletNewPassphrasePage);
  }

}
