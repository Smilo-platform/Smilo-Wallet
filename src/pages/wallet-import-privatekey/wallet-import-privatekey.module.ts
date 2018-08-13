import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { WalletImportPrivatekeyPage } from "./wallet-import-privatekey";
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../components/components.module";
import { PasswordStrengthBarModule } from "ng2-password-strength-bar";

@NgModule({
  declarations: [
    WalletImportPrivatekeyPage
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPrivatekeyPage),
    TranslateModule,
    PasswordStrengthBarModule,
    ComponentsModule
  ],
})
export class WalletImportPrivatekeyPageModule {}
