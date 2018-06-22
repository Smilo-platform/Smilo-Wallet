import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewDisclaimerPage } from './wallet-new-disclaimer';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletNewDisclaimerPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewDisclaimerPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletNewDisclaimerPageModule {}
