import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPassphrasePage } from './wallet-new-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { PassphraseService } from '../../services/passphrase-service/passphrase-service';

@NgModule({
  declarations: [
    WalletNewPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPassphrasePage),
    TranslateModule
  ],
  providers: [
    PassphraseService
  ]
})
export class WalletNewPassphrasePageModule {}
