import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPage } from './wallet-new';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletNewPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPage),
    TranslateModule
  ],
})
export class WalletNewPageModule {}
