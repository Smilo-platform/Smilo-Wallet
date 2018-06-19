import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsGeneralPage } from './settings-general';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingsGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsGeneralPage),
    TranslateModule,
  ]
})
export class SettingsGeneralPageModule {}
