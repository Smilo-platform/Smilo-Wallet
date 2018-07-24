import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PasswordExplanationPage } from "../password-explanation/password-explanation";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { IPasswordValidationResult, PasswordService } from "../../services/password-service/password-service";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { SettingsService, ThemeType } from "../../services/settings-service/settings-service";

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
  passwordStatus: IPasswordValidationResult;
  selectedTheme: ThemeType;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private modalController: ModalController,
              private keyStoreService: KeyStoreService,
              private passwordService: PasswordService,
              private settingsService: SettingsService) {
  }

  import(): Promise<void> {
    if(this.dataIsValid()) {
      let wallet = this.prepareWallet();
      return this.goToPrepareWalletPage(wallet, this.password);
    }
    else {
      return Promise.reject("");
    }
  }

  ngOnInit(): void {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  goToPrepareWalletPage(wallet: ILocalWallet, password: string) {
    let params = {
      wallet: wallet,
      password: password
    };
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    return this.navCtrl.push(PrepareWalletPage, params);
  }

  /**
   * Prepares the wallet based on the currently entered data.
   */
  prepareWallet(): ILocalWallet {
    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      name: this.name,
      type: "local",
      publicKey: null,
      keyStore: this.keyStoreService.createKeyStore(this.privateKey, this.password),
      lastUpdateTime: null
    };

    return wallet;
  }

  onPasswordsChanged() {
    this.passwordStatus = this.passwordService.validate(this.password, this.confirmedPassword);
  }
  
  showPasswordExplanation() {
    let modal = this.modalController.create(PasswordExplanationPage, undefined, { cssClass: this.selectedTheme });

    modal.present();
  }

  dataIsValid() {
    return this.privateKey.length > 0 &&
           !this.passwordsArePristine() &&
           this.passwordStatus &&
           this.passwordStatus.type == "success" &&
           this.name.length > 0;
  }

  passwordsArePristine(): boolean {
    return this.password.length == 0 ||
           this.confirmedPassword.length == 0;
  }
}
