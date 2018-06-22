import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPage } from './wallet-import';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletImportPageModule {}
