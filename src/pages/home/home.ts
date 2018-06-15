import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { WalletPage, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";
import { AboutPage } from "../about/about";
import { FaqPage } from "../faq/faq";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  constructor(private navController: NavController) {
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
