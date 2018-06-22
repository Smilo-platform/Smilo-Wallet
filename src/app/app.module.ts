import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SmiloWallet } from "./app.component";
import { HomePageModule } from "../pages/home/home.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AboutPageModule } from "../pages/about/about.module";
import { WalletOverviewPageModule } from "../pages/wallet-overview/wallet-overview.module";
import { WalletPageModule } from "../pages/wallet/wallet.module";
import { FaqPageModule } from "../pages/faq/faq.module";
import { SettingsGeneralPageModule } from "../pages/settings-general/settings-general.module";
import { TransferPageModule } from "../pages/transfer/transfer.module";
import { WalletImportKeystorePageModule } from "../pages/wallet-import-keystore/wallet-import-keystore.module";
import { WalletImportLedgerPageModule } from "../pages/wallet-import-ledger/wallet-import-ledger.module";
import { WalletImportPrivatekeyPageModule } from "../pages/wallet-import-privatekey/wallet-import-privatekey.module";
import { RestoreBackupPageModule } from "../pages/restore-backup/restore-backup.module";
import { CryptoKeyService } from "../services/crypto-key-service/crypto-key-service";
import { LandingPageModule } from "../pages/landing/landing.module";
import { WalletService } from "../services/wallet-service/wallet-service";
import { IonicStorageModule } from "@ionic/storage";
import { WalletNewPageModule } from "../pages/wallet-new/wallet-new.module";
import { WalletImportPageModule } from "../pages/wallet-import/wallet-import.module";
import { WalletNewPassphrasePageModule } from "../pages/wallet-new-passphrase/wallet-new-passphrase.module";
import { WalletNewPasswordPageModule } from "../pages/wallet-new-password/wallet-new-password.module";
import { WalletNewDisclaimerPageModule } from "../pages/wallet-new-disclaimer/wallet-new-disclaimer.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationHelperService } from "../services/navigation-helper-service/navigation-helper-service";
import { PasswordExplanationPage } from "../pages/password-explanation/password-explanation";
import { PasswordExplanationPageModule } from "../pages/password-explanation/password-explanation.module";
import { KeyStoreService } from "../services/key-store-service/key-store-service";
import { PasswordService } from "../services/password-service/password-service";
import { SettingsService } from "../services/settings-service/settings-service";
import { BIP39Service } from "../services/bip39-service/bip39-service";
import { HockeyApp } from "ionic-hockeyapp";
import { ComponentsModule } from "../components/components.module";
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from "@ionic-native/file-picker";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/");
}

@NgModule({
  declarations: [
    SmiloWallet
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }),
    HomePageModule,
    AboutPageModule,
    WalletOverviewPageModule,
    WalletPageModule,
    FaqPageModule,
    SettingsGeneralPageModule,
    TransferPageModule,
    WalletImportKeystorePageModule,
    WalletImportLedgerPageModule,
    WalletImportPrivatekeyPageModule,
    RestoreBackupPageModule,
    LandingPageModule,
    ComponentsModule,
    WalletNewPageModule,
    WalletNewPassphrasePageModule,
    WalletNewPasswordPageModule,
    WalletNewDisclaimerPageModule,
    WalletImportPageModule,
    WalletNewPasswordPageModule,
    PasswordExplanationPageModule,
    IonicModule.forRoot(SmiloWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmiloWallet,
    PasswordExplanationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,
    IOSFilePicker,
    CryptoKeyService,
    WalletService,
    NavigationHelperService,
    KeyStoreService,
    PasswordService,
    SettingsService,
    BIP39Service,
    HockeyApp,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
