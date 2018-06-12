import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletNewDisclaimerPage } from "../wallet-new-disclaimer/wallet-new-disclaimer";
import { IPasswordValidationResult, PasswordService } from "../../services/password-service/password-service";

@IonicPage()
@Component({
  selector: "page-wallet-new-password",
  templateUrl: "wallet-new-password.html",
})
export class WalletNewPasswordPage {

  enteredPassword: string = "";
  validatedPassword: string = "";

  passwordStatus: IPasswordValidationResult;

  passphrase: string[];

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private passwordService: PasswordService) {
    // Read the passphrase
    this.passphrase = this.navParams.get("passphrase");
  }

  onPasswordsChanged() {
    this.passwordStatus = this.passwordService.validate(this.enteredPassword, this.validatedPassword);
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
