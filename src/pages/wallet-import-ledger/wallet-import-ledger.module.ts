import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportLedgerPage } from './wallet-import-ledger';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletImportLedgerPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportLedgerPage),
    TranslateModule
  ],
})
export class WalletImportLedgerPageModule {}
