import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-password-explanation",
  templateUrl: "password-explanation.html",
})
export class PasswordExplanationPage {
  constructor(private viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
