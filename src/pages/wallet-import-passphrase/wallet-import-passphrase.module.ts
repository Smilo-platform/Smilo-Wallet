import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPassphrasePage } from './wallet-import-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletImportPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPassphrasePage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletImportPassphrasePageModule {}
