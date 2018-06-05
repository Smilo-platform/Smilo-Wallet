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
import { SettingsWalletPageModule } from "../pages/settings-wallet/settings-wallet.module";
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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SmiloWallet
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    HomePageModule,
    AboutPageModule,
    WalletOverviewPageModule,
    WalletPageModule,
    FaqPageModule,
    SettingsGeneralPageModule,
    SettingsWalletPageModule,
    TransferPageModule,
    WalletImportKeystorePageModule,
    WalletImportLedgerPageModule,
    WalletImportPrivatekeyPageModule,
    RestoreBackupPageModule,
    LandingPageModule,
    WalletNewPageModule,
    WalletNewPassphrasePageModule,
    WalletNewPasswordPageModule,
    WalletNewDisclaimerPageModule,
    WalletImportPageModule,
    IonicModule.forRoot(SmiloWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmiloWallet
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CryptoKeyService,
    WalletService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
