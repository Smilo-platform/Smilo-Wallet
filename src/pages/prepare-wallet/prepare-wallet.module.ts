import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrepareWalletPage } from './prepare-wallet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PrepareWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(PrepareWalletPage),
    TranslateModule
  ],
})
export class PrepareWalletPageModule {}
