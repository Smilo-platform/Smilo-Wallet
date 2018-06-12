import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { WalletPage, NAVIGATION_ORIGIN_KEY } from '../wallet/wallet';
import { RestoreBackupPage } from '../restore-backup/restore-backup';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(private navCtrl: NavController) {
  }

  openNewWallet() {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = "landing";

    this.navCtrl.push(WalletPage, params);
  }

  openRestoreBackup() {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = "landing";

    this.navCtrl.push(RestoreBackupPage, params);
  }
}
