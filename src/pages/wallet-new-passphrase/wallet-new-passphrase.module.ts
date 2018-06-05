import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPassphrasePage } from './wallet-new-passphrase';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletNewPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPassphrasePage),
    TranslateModule
  ],
})
export class WalletNewPassphrasePageModule {}
