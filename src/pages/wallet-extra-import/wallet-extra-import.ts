import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";

export interface IWalletExtraImportDismissData {
  /**
   * True if an extra wallet should be imported.
   */
  importExtra: boolean;
  /**
   * The index of the extra wallet to import
   */
  index?: number;
}

@IonicPage()
@Component({
  selector: "page-wallet-extra-import",
  templateUrl: "wallet-extra-import.html",
})
export class WalletExtraImportPage {

  nextIndex: number;

  importAnotherWallet: boolean = false;

  constructor(private navParams: NavParams,
              private viewController: ViewController) {
    this.nextIndex = this.navParams.get("nextIndex");
  }

  no() {
    let data: IWalletExtraImportDismissData = {
      importExtra: false
    };

    this.viewController.dismiss(data);
  }

  yes() {
    this.importAnotherWallet = true;

    // let data: IWalletExtraImportDismissData = {
    //   importExtra: true,
    //   index: this.nextIndex
    // };

    // this.viewController.dismiss(data);
  }
}
