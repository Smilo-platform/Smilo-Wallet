import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsGeneralPage } from './settings-general';

@NgModule({
  declarations: [
    SettingsGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsGeneralPage),
  ],
})
export class SettingsGeneralPageModule {}
