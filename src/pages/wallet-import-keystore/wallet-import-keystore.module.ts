import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportKeystorePage } from './wallet-import-keystore';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletImportKeystorePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportKeystorePage),
    TranslateModule
  ],
})
export class WalletImportKeystorePageModule {}
