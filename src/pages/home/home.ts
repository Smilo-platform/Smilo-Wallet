import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { WalletPage } from "../wallet/wallet";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";
import { AboutPage } from "../about/about";
import { FaqPage } from "../faq/faq";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  constructor(private navController: NavController) {
  }

  openNewWallet() {
    this.navController.push(WalletPage);
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
