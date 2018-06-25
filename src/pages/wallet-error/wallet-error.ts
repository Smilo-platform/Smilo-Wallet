import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { ViewController } from "ionic-angular/navigation/view-controller";

@IonicPage()
@Component({
  selector: "page-wallet-error",
  templateUrl: "wallet-error.html",
})
export class WalletErrorPage {

  error: string;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private viewController: ViewController) {
    this.error = this.navParams.get("error");
  }

  goBack() {
    this.viewController.dismiss();
  }

}
