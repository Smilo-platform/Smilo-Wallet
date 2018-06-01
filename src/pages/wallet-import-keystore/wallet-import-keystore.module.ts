import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportKeystorePage } from './wallet-import-keystore';

@NgModule({
  declarations: [
    WalletImportKeystorePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportKeystorePage),
  ],
})
export class WalletImportKeystorePageModule {}
