import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the WalletImportPrivatekeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-wallet-import-privatekey",
  templateUrl: "wallet-import-privatekey.html",
})
export class WalletImportPrivatekeyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletImportPrivatekeyPage");
  }

}
