import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
import { SettingsService } from "../services/settings-service/settings-service";
import { HockeyApp } from "ionic-hockeyapp";

const HOCKEY_APP_ANDROID_ID = "551bfde014ca4620996d78a376671a01";
const HOCKEY_APP_IOS_ID = "";
const HOCKEY_APP_AUTO_SEND_AUTO_UPDATES = true;
const HOCKEY_APP_IGNORE_ERROR_HEADER = true;

@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;
  selectedTheme: string;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private translate: TranslateService,
              private walletService: WalletService,
              private hockeyApp: HockeyApp,
              private settingsService: SettingsService) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.prepareSettings();
      
      this.prepareTranslations();

      this.prepareHockeyAppIntegration();

      this.prepareFirstPage();
    });
  }

  prepareSettings() {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
    
    if (this.platform.is('ios')) {
      window['plugins'].webviewcolor.change('#fff');
    }

    this.settingsService.getLanguageSettings().then(data => {
      this.translate.setDefaultLang("en");

      this.translate.use(data || "en");
    });

    this.settingsService.getNightModeSettings().then(data => {
      this.settingsService.setActiveTheme(data || 'light-theme');
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
