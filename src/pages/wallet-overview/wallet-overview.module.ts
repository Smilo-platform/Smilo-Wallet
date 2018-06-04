import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletOverviewPage } from './wallet-overview';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletOverviewPage),
    TranslateModule
  ],
})
export class WalletOverviewPageModule {}
