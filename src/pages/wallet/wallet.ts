import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { RestoreBackupPage } from "../restore-backup/restore-backup";
import { WalletNewPage } from "../wallet-new/wallet-new";
import { WalletImportPage } from "../wallet-import/wallet-import";

export declare type NavigationOrigin = "landing" | "home" | "wallet_overview";
export const NAVIGATION_ORIGIN_KEY = "NAVIGATION_ORIGIN";

@IonicPage()
@Component({
  selector: "page-wallet",
  templateUrl: "wallet.html",
})
export class WalletPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openNewWalletPage() {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    this.navCtrl.push(WalletNewPage, params);
  }

  openLoadWalletPage() {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    this.navCtrl.push(WalletImportPage, params);
  }

}
