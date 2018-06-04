import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletPage } from '../wallet/wallet';
import { RestoreBackupPage } from '../restore-backup/restore-backup';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  openNewWallet() {
    this.navCtrl.push(WalletPage);
  }

  openRestoreBackup() {
    this.navCtrl.push(RestoreBackupPage);
  }
}
