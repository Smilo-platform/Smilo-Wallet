import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPasswordPage } from './wallet-new-password';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletNewPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPasswordPage),
    TranslateModule
  ],
})
export class WalletNewPasswordPageModule {}
