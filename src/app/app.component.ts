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
import { BIP32Service } from "../services/bip32-service/bip32-service";
import { MerkleTree } from "../merkle/MerkleTree";
import { Storage } from "@ionic/storage";
import { KeyStoreService } from "../services/key-store-service/key-store-service";

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
              private hockeyApp: HockeyApp,
              private bip32Service: BIP32Service,
              private storage: Storage,
              private keyStoreService: KeyStoreService) {
    settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // Seed based on 256bits entropy with value of 0
      // let seed = "5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4";

      // let pair = this.bip32Service.getKeyPair(seed);

      // console.log(pair.privateKey);

      // MerkleTree.fromDisk("wallet", this.storage).then(
      //   (tree) => {
          
      //   }
      // )

      // MerkleTree.fromDisk("wallet", this.storage, keyStoreService, "pass123").then( 
      MerkleTree.generate("hello", 18).then(
        (tree) => {
          console.log(tree);
          console.log(tree.getPublicKey());

          tree.serialize("wallet", this.storage, this.keyStoreService, "pass123").then(
            () => {
              console.log("Serialized!");
            },
            (error) => {
              console.error(error);
            }
          )
        },
        (error) => {
          console.error(error);
        }
      );

      // this.prepareTranslations();

      // this.prepareHockeyAppIntegration();

      // this.prepareFirstPage();
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
