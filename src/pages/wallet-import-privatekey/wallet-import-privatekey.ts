import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { IWallet } from "../../models/IWallet";
import { HomePage } from "../home/home";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { PasswordExplanationPage } from "../password-explanation/password-explanation";

@IonicPage()
@Component({
  selector: "page-wallet-import-privatekey",
  templateUrl: "wallet-import-privatekey.html",
})
export class WalletImportPrivatekeyPage {

  privateKey: string = "";
  name: string = "";
  password: string = "";
  confirmedPassword: string = "";

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private cryptoKeyService: CryptoKeyService,
              private navigationHelperService: NavigationHelperService,
              private modalController: ModalController) {
  }

  import(): Promise<void> {
    if(this.dataIsValid()) {
      let wallet = this.prepareWallet();

      return this.walletService.store(wallet).then(
        () => {
          // Go back to home page. This is not perfect.
          return this.goBackToOriginPage();
        },
        (error) => {
          // Storing wallet failed, how will we handle this?
        }
      );
    }
    else {
      return Promise.resolve();
    }
  }

  goBackToOriginPage() {
    switch(<NavigationOrigin>this.navParams.get(NAVIGATION_ORIGIN_KEY) || "landing") {
      case("landing"):
        this.navCtrl.setRoot(HomePage);
        break;
      case("home"):
        this.navigationHelperService.navigateBack(this.navCtrl, 3);
        break;
      case("wallet_overview"):
        this.navigationHelperService.navigateBack(this.navCtrl, 3);
        break;
    }
  }

  /**
   * Prepares the wallet based on the currently entered data.
   */
  prepareWallet(): IWallet {
    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      name: this.name,
      type: "local",
      publicKey: this.cryptoKeyService.generatePublicKey(this.privateKey),
      encryptedPrivateKey: this.cryptoKeyService.encryptPrivateKey(this.privateKey, this.password)
    };

    return wallet;
  }
  
  showPasswordExplanation() {
    let modal = this.modalController.create(PasswordExplanationPage);

    console.log(`MODEL = ${ modal }`);

    modal.present();
  }

  dataIsValid() {
    return this.privateKey.length > 0 &&
           !this.passwordsArePristine() &&
           this.passwordsAreValid() &&
           this.name.length > 0;
  }

  passwordsArePristine(): boolean {
    return this.password.length == 0 ||
           this.confirmedPassword.length == 0;
  }
  passwordsAreValid(): boolean {
    return this.password == this.confirmedPassword;
  }
}
