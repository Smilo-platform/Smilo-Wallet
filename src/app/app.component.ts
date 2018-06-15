import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
import { SettingsProvider } from './../providers/settings/settings';
import { SettingsService } from "../services/settings-service/settings-service";

@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;
  selectedTheme: String;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              translate: TranslateService,
              walletService: WalletService,
              settings: SettingsProvider,
              settingsService: SettingsService) {
    settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      if (platform.is('ios')) {
        window['plugins'].webviewcolor.change('#fff');
      }
      statusBar.styleDefault();
      splashScreen.hide();

      settingsService.getLanguageSettings().then(data => {
        translate.setDefaultLang("en");

        translate.use(data || "en");
      });

      settingsService.getNightModeSettings().then(data => {
        settings.setActiveTheme(data || 'light-theme');
      })

      walletService.getAll().then(
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
    });
  }
}
