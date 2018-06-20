import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsWalletPage } from './settings-wallet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingsWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsWalletPage),
    TranslateModule
  ],
})
export class SettingsWalletPageModule {}
