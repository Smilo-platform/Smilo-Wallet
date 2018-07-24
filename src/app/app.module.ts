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
import { BIP32Service } from "../services/bip32-service/bip32-service";
import { MerkleTreeService } from "../services/merkle-tree-service/merkle-tree-service";
import { PrepareWalletPageModule } from "../pages/prepare-wallet/prepare-wallet.module";
import { ComponentsModule } from "../components/components.module";
import { File as FileNative} from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Clipboard } from '@ionic-native/clipboard';
import { WalletErrorPage } from "../pages/wallet-error/wallet-error";
import { WalletErrorPageModule } from "../pages/wallet-error/wallet-error.module";
import { BulkTranslateService } from "../services/bulk-translate-service/bulk-translate-service";
import { WalletImportPassphrasePageModule } from "../pages/wallet-import-passphrase/wallet-import-passphrase.module";
import { ExchangesService } from "../services/exchanges-service/exchanges-service";
import { WalletTransactionHistoryService } from "../services/wallet-transaction-history-service/wallet-transaction-history-service";
import { UrlService } from "../services/url-service/url-service";
import { WalletExtraImportPageModule } from "../pages/wallet-extra-import/wallet-extra-import.module";
import { WalletExtraImportPage } from "../pages/wallet-extra-import/wallet-extra-import";
import { TransactionSignService } from "../services/transaction-sign-service/transaction-sign-service";
import { TransferTransactionService } from "../services/transfer-transaction-service/transfer-transaction";
import { AddressService } from "../services/address-service/address-service";

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
    IonicStorageModule.forRoot(),
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
    WalletImportPassphrasePageModule,
    LandingPageModule,
    ComponentsModule,
    WalletNewPageModule,
    WalletNewPassphrasePageModule,
    WalletNewPasswordPageModule,
    WalletNewDisclaimerPageModule,
    WalletImportPageModule,
    WalletNewPasswordPageModule,
    PasswordExplanationPageModule,
    PrepareWalletPageModule,
    WalletErrorPageModule,
    WalletExtraImportPageModule,
    IonicModule.forRoot(SmiloWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmiloWallet,
    PasswordExplanationPage,
    WalletErrorPage,
    WalletExtraImportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WalletService,
    NavigationHelperService,
    KeyStoreService,
    PasswordService,
    SettingsService,
    FileNative,
    UrlService,
    BulkTranslateService,
    ExchangesService,
    AndroidPermissions,
    BIP39Service,
    BIP32Service,
    TransferTransactionService,
    Clipboard,
    WalletTransactionHistoryService,
    HockeyApp,
    MerkleTreeService,
    TransactionSignService,
    AddressService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
