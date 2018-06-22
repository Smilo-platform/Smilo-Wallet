import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportKeystorePage } from './wallet-import-keystore';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletImportKeystorePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportKeystorePage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletImportKeystorePageModule {}
