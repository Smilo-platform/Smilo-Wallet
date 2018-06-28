import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { WalletExtraImportPage } from "./wallet-extra-import";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    WalletExtraImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletExtraImportPage),
    TranslateModule
  ],
})
export class WalletExtraImportPageModule {}
