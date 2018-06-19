import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { WalletPage, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";
import { AboutPage } from "../about/about";
import { FaqPage } from "../faq/faq";
import { SplashScreen } from "@ionic-native/splash-screen";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  constructor(private navController: NavController,
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
    params[NAVIGATION_ORIGIN_KEY] = "home";

    this.navController.push(WalletPage, params);
  }

  openMyWallet() {
    this.navController.push(WalletOverviewPage);
  }

  openAbout() {
    this.navController.push(AboutPage);
  }

  openFaq() {
    this.navController.push(FaqPage);
  }
}
