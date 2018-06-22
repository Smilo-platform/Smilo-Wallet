import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPage } from './wallet-new';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletNewPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletNewPageModule {}
