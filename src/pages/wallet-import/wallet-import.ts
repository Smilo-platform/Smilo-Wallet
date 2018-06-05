import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { RestoreBackupPage } from "../restore-backup/restore-backup";

@IonicPage()
@Component({
  selector: "page-wallet-import",
  templateUrl: "wallet-import.html",
})
export class WalletImportPage {

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
