import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPassphrasePage } from './wallet-new-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletNewPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPassphrasePage),
    TranslateModule,
    ComponentsModule
  ],
  providers: [
    
  ]
})
export class WalletNewPassphrasePageModule {}
