import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { Page } from "ionic-angular/navigation/nav-util";
import { WalletImportPassphrasePage } from "../wallet-import-passphrase/wallet-import-passphrase";

@IonicPage()
@Component({
  selector: "page-wallet-import",
  templateUrl: "wallet-import.html",
})
export class WalletImportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openImportKeystorePage() {
    this.navigateTo(WalletImportKeystorePage);
  }

  openImportPrivatekeyPage() {
    this.navigateTo(WalletImportPrivatekeyPage);
  }

  openImportLedgerPage() {
    this.navigateTo(WalletImportLedgerPage);
  }

  openRestoreBackupPage() {
    this.navigateTo(WalletImportPassphrasePage);
  }

  navigateTo(page: Page) {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    this.navCtrl.push(page, params);
  }

}
