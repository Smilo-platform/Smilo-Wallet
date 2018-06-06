import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletNewDisclaimerPage } from "../wallet-new-disclaimer/wallet-new-disclaimer";

@IonicPage()
@Component({
  selector: "page-wallet-new-password",
  templateUrl: "wallet-new-password.html",
})
export class WalletNewPasswordPage {

  enteredPassword: string = "";
  validatedPassword: string = "";

  passphrase: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Read the passphrase
    this.passphrase = this.navParams.get("passphrase");
  }

  next() {
    if(!this.passwordsArePristine() && this.passwordsAreValid()) {
      this.navCtrl.push(WalletNewDisclaimerPage, {
        passphrase: this.passphrase,
        password: this.enteredPassword
      });
    }
  }

  passwordsArePristine() {
    return this.enteredPassword.length == 0 || this.validatedPassword.length == 0;
  }

  passwordsAreValid() {
    return this.enteredPassword == this.validatedPassword;
  }
}
