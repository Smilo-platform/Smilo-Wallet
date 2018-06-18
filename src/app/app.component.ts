import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
import { SettingsProvider } from './../providers/settings/settings';
import { HockeyApp } from "ionic-hockeyapp";

const HOCKEY_APP_ANDROID_ID = "7e9d4c16c2a44e25b73db158e064019b";
const HOCKEY_APP_IOS_ID = "";
const HOCKEY_APP_AUTO_SEND_AUTO_UPDATES = true;
const HOCKEY_APP_IGNORE_ERROR_HEADER = true;

@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;
  selectedTheme: String;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private translate: TranslateService,
              private walletService: WalletService,
              private settings: SettingsProvider,
              private hockeyApp: HockeyApp) {
    settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      statusBar.styleDefault();

      this.prepareTranslations();

      this.prepareHockeyAppIntegration();

      this.prepareFirstPage();
    });
  }

  prepareTranslations() {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  prepareHockeyAppIntegration() {
    this.hockeyApp.start(HOCKEY_APP_ANDROID_ID, HOCKEY_APP_IOS_ID,
      HOCKEY_APP_AUTO_SEND_AUTO_UPDATES, HOCKEY_APP_IGNORE_ERROR_HEADER).then(
      () => {
        console.log("Hockey App SDK initialized");
      },
      (error) => {
        console.error(error);
      }
    );
  }

  prepareFirstPage() {
    this.walletService.getAll().then(
      (wallets) => {
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
  }
}
