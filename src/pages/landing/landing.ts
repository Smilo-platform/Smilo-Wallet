import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { WalletPage, NAVIGATION_ORIGIN_KEY } from '../wallet/wallet';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsGeneralPage } from '../settings-general/settings-general';
import { WalletImportPassphrasePage } from '../wallet-import-passphrase/wallet-import-passphrase';
import { WalletImportPage } from '../wallet-import/wallet-import';
import { WalletNewPage } from '../wallet-new/wallet-new';

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

    this.navCtrl.push(WalletNewPage, params);
  }

  openRestoreBackup() {
    let params = {};
    params[NAVIGATION_ORIGIN_KEY] = "landing";

    this.navCtrl.push(WalletImportPage, params);
  }

  openSettingsPage() {
    this.navCtrl.push(SettingsGeneralPage);
  }
}
