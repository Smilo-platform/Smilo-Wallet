import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestoreBackupPage } from './restore-backup';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RestoreBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(RestoreBackupPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class RestoreBackupPageModule {}
