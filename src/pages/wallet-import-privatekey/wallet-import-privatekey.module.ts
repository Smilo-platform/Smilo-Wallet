import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPrivatekeyPage } from './wallet-import-privatekey';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordExplanationComponent } from '../../components/password-explanation/password-explanation';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletImportPrivatekeyPage
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPrivatekeyPage),
    TranslateModule
  ],
})
export class WalletImportPrivatekeyPageModule {}
