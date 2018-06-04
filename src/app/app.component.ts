import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { CryptoKeyService } from "../services/crypto-key-service";
import { LandingPage } from "../pages/landing/landing";
@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private translate: TranslateService,
              private cryptoKeyService: CryptoKeyService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang("en");
      translate.use("en");

      this.cryptoKeyService.isNew().then(
        (isNew) => {
          if(isNew) {
            this.rootPage = LandingPage;
          }
          else {
            this.rootPage = HomePage;
          }
        },
        (error) => {
          // Something went wrong reading the crypto keys.
          // How will we handle this? Generic error page maybe?
        }
      )
    });
  }
}
