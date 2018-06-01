import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportLedgerPage } from './wallet-import-ledger';

@NgModule({
  declarations: [
    WalletImportLedgerPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportLedgerPage),
  ],
})
export class WalletImportLedgerPageModule {}
