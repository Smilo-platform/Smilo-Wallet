import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { RestoreBackupPage } from "../restore-backup/restore-backup";

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-wallet",
  templateUrl: "wallet.html",
})
export class WalletPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openImportKeystorePage() {
    this.navCtrl.push(WalletImportKeystorePage);
  }

  openImportPrivatekeyPage() {
    this.navCtrl.push(WalletImportPrivatekeyPage);
  }

  openImportLedgerPage() {
    this.navCtrl.push(WalletImportLedgerPage);
  }

  openRestoreBackupPage() {
    this.navCtrl.push(RestoreBackupPage);
  }

}
