import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletOverviewPage } from './wallet-overview';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletOverviewPage
  ],
  imports: [
    IonicPageModule.forChild(WalletOverviewPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletOverviewPageModule {}
