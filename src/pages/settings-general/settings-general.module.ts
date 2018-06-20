import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsGeneralPage } from './settings-general';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SettingsGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsGeneralPage),
    TranslateModule,
    ComponentsModule
  ]
})
export class SettingsGeneralPageModule {}
