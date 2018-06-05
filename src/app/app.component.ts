import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              translate: TranslateService,
              walletService: WalletService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang("en");
      translate.use("en");

      setTimeout(() => {
        console.log("Retrieving wallets...");
        walletService.getAll().then(
          (wallets) => {
            console.log("Wallets retrieved!");
            if(wallets.length == 0) {
              this.rootPage = LandingPage;
            }
            else {
              this.rootPage = HomePage;
            }
          },
          (error) => {
            // Something went wrong reading the crypto keys.
            // How will we handle this? Generic error page maybe?
            console.error(error);
          }
        );
      }, 2000);

      
    });
  }
}
