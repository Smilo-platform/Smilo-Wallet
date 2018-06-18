import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { WalletPage, NAVIGATION_ORIGIN_KEY } from '../wallet/wallet';
import { RestoreBackupPage } from '../restore-backup/restore-backup';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(private navCtrl: NavController,
              private splashscreen: SplashScreen) {
  }

  ionViewDidEnter() {
    // Wait 250ms before hiding the splashscreen.
    // This allows the HTML to fully load and prevents a short white screen from showing.
    setTimeout(() => {
      this.splashscreen.hide();
    }, 250);
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
