import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { WalletService } from "../services/wallet-service/wallet-service";
import { SettingsService, ThemeType } from "../services/settings-service/settings-service";
import { HockeyApp } from "ionic-hockeyapp";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { StatusBar } from '@ionic-native/status-bar';
import { AssetService } from "../services/asset-service/asset-service";

const HOCKEY_APP_ANDROID_ID = "551bfde014ca4620996d78a376671a01";
const HOCKEY_APP_IOS_ID = "7bd562fbce34466bb7efb63b63c86080";
const HOCKEY_APP_AUTO_SEND_AUTO_UPDATES = true;
const HOCKEY_APP_IGNORE_ERROR_HEADER = true;

@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any;
  selectedTheme: ThemeType;

  constructor(private platform: Platform, 
              private androidPermissions: AndroidPermissions,
              private translate: TranslateService,
              private walletService: WalletService,
              private hockeyApp: HockeyApp,
              private settingsService: SettingsService,
              private statusBar: StatusBar,
              private assetService: AssetService) {

  }

  ngOnInit(): Promise<void> {
    this.statusBar.styleLightContent();
    return this.platform.ready().then(() => {
      this.prepareAssetCache();

      this.preparePermissions();

      this.prepareSettings();

      this.prepareHockeyAppIntegration();

      this.prepareFirstPage();
    });
  }

  prepareAssetCache() {
    // Do a dummy call to retrieve all assets. This will ensure
    // the cache is filled when it is actually needed.
    this.assetService.getAll();
  }

  preparePermissions(): void {
    if (this.platform.is("android")) {
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
    }
  }

  prepareSettings(): Promise<void[]> {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);

    let languageSettingsPromise = this.settingsService.getLanguageSettings().then(data => {
      this.translate.setDefaultLang("en");

      this.translate.use(data || "en");
    });

    let nightModePromise = this.settingsService.getNightModeSettings().then(data => {
      this.settingsService.setActiveTheme(data || 'light-theme');
    });

    let fundsSwitchPromise = this.settingsService.getFundsSwitchSettings().then(data => {
      let status = true;
      if (data !== null) status = data;
      this.settingsService.setFundsSwitchStatus(status);
    })

    return Promise.all([languageSettingsPromise, nightModePromise, fundsSwitchPromise]);
  }

  prepareHockeyAppIntegration(): Promise<void> {
    return this.hockeyApp.start(HOCKEY_APP_ANDROID_ID, HOCKEY_APP_IOS_ID,
        HOCKEY_APP_AUTO_SEND_AUTO_UPDATES, HOCKEY_APP_IGNORE_ERROR_HEADER);
  }

  prepareFirstPage(): Promise<void> {
    return new Promise((resolve, reject) => { this.walletService.getAll().then(
        (wallets) => {
          if (wallets.length === 0) {
            this.rootPage = LandingPage;
          }
          else {
            this.rootPage = HomePage;
          }
          resolve();
        },
        (error) => {
          // Something went wrong reading the crypto keys.
          // How will we handle this? Generic error page maybe?
          reject();
        }
      );
    })
  }
}
