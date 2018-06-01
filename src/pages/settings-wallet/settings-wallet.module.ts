import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsWalletPage } from './settings-wallet';

@NgModule({
  declarations: [
    SettingsWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsWalletPage),
  ],
})
export class SettingsWalletPageModule {}
