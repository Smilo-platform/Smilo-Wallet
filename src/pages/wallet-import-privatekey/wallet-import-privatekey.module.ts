import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPrivatekeyPage } from './wallet-import-privatekey';

@NgModule({
  declarations: [
    WalletImportPrivatekeyPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPrivatekeyPage),
  ],
})
export class WalletImportPrivatekeyPageModule {}
