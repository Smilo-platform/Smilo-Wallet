import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestoreBackupPage } from './restore-backup';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RestoreBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(RestoreBackupPage),
    TranslateModule
  ],
})
export class RestoreBackupPageModule {}
