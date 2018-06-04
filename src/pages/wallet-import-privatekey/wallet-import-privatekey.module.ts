import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPrivatekeyPage } from './wallet-import-privatekey';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletImportPrivatekeyPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPrivatekeyPage),
    TranslateModule
  ],
})
export class WalletImportPrivatekeyPageModule {}
