import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletNewPasswordPage } from './wallet-new-password';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WalletNewPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletNewPasswordPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class WalletNewPasswordPageModule {}
