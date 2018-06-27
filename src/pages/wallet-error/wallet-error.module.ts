import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { WalletErrorPage } from "./wallet-error";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    WalletErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletErrorPage),
    TranslateModule
  ],
})
export class WalletErrorPageModule {}
