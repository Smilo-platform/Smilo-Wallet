import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { WalletIndexValidator } from "../../validators/WalletIndexValidator";

export interface IWalletExtraImportDismissData {
  /**
   * True if an extra wallet should be imported.
   */
  importExtra: boolean;
  /**
   * The index of the extra wallet to import
   */
  index?: number;
  /**
   * The name of the extra wallet to import
   */
  name?: string;
}

@IonicPage()
@Component({
  selector: "page-wallet-extra-import",
  templateUrl: "wallet-extra-import.html",
})
export class WalletExtraImportPage {

  nextIndex: number;
  walletName: string;

  importAnotherWallet: boolean = false;

  form: FormGroup;

  constructor(private navParams: NavParams,
              private viewController: ViewController,
              private formBuilder: FormBuilder) {
    this.nextIndex = this.navParams.get("nextIndex");

    this.form = this.formBuilder.group({
      walletName: ["", Validators.compose([Validators.required])],
      nextIndex: ["", Validators.compose([Validators.required, WalletIndexValidator()])]
    });
  }

  no() {
    let data: IWalletExtraImportDismissData = {
      importExtra: false
    };

    this.viewController.dismiss(data);
  }

  yes() {
    this.importAnotherWallet = true;
  }

  back() {
    this.importAnotherWallet = false;
  }

  import() {
    let data: IWalletExtraImportDismissData = {
      importExtra: true,
      index: this.nextIndex,
      name: this.walletName
    };

    this.viewController.dismiss(data);
  }
}
