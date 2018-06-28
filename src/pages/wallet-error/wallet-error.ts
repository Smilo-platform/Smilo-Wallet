import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { ViewController } from "ionic-angular/navigation/view-controller";

@IonicPage()
@Component({
  selector: "page-wallet-error",
  templateUrl: "wallet-error.html",
})
export class WalletErrorPage {

  error: string;

  constructor(private navParams: NavParams,
              private viewController: ViewController) {
    this.error = this.navParams.get("error");
  }

  goBack() {
    this.viewController.dismiss();
  }

}
