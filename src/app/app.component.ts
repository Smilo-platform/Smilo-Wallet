import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
import { SettingsProvider } from './../providers/settings/settings';
import { PassphraseService } from "../services/passphrase-service/passphrase-service";

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
              private passphraseService: PassphraseService) {
    settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang("en");
      translate.use("en");

      this.passphraseService.generate(128).then(
        (result) => {
          console.log(`Entropy: ${ result.entropy }`);
          console.log(`Phrase: ${ result.passphrase }`);
          console.log(`Seed: ${ result.seed }`);
          console.log(`Key: ${ result.key }`);

          // this.passphraseService.isValidPassphrase(phrase).then(
          //   (valid) => {
          //     console.log(`Passphrase is ${ valid ? '' : 'not'} valid`);
          //   }
          // )
        },
        (error) => {
          console.error(error);
        }
      )

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
