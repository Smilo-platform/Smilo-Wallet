import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPassphrasePage } from './wallet-new-passphrase';

@NgModule({
  declarations: [
    WalletNewPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPassphrasePage),
  ],
})
export class WalletNewPassphrasePageModule {}
