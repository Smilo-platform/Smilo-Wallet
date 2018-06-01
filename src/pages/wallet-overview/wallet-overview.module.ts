import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletOverviewPage } from './wallet-overview';

@NgModule({
  declarations: [
    WalletOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletOverviewPage),
  ],
})
export class WalletOverviewPageModule {}
