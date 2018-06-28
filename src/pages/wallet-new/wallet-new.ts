import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { WalletNewPassphrasePage } from "../wallet-new-passphrase/wallet-new-passphrase";

@IonicPage()
@Component({
  selector: "page-wallet-new",
  templateUrl: "wallet-new.html",
})
export class WalletNewPage {

  constructor(private navCtrl: NavController) {
  }

  goToPassphrasePage() {
    this.navCtrl.push(WalletNewPassphrasePage);
  }

}
