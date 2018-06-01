import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestoreBackupPage } from './restore-backup';

@NgModule({
  declarations: [
    RestoreBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(RestoreBackupPage),
  ],
})
export class RestoreBackupPageModule {}
