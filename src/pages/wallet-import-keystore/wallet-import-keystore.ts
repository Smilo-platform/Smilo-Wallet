import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController } from "ionic-angular";
import { IKeyStore } from "../../models/IKeyStore";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { HomePage } from "../home/home";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-wallet-import-keystore",
  templateUrl: "wallet-import-keystore.html",
})
export class WalletImportKeystorePage {

  name: string = "";
  password: string = "";
  keyStoreString: string = "";

  /**
   * The parsed keystore if valid key store JSON was pasted by the user.
   */
  keyStore: IKeyStore = null;

  /**
   * Set to true if the pasted key store JSON was not valid.
   */
  keyStoreIsInvalid: boolean = false;
  /**
   * Set to true if the keystore could not be decrypted with the password.
   */
  passwordIsInvalid: boolean = false;

  /**
   * The translated message to shown when the importing succeeded.
   */
  successMessage: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private keyStoreService: KeyStoreService,
              private cryptoKeyService: CryptoKeyService,
              private navigationHelperService: NavigationHelperService,
              private toastController: ToastController,
              private translateService: TranslateService) {
    this.translateService.get("import_keystore.toast.success").subscribe(
      (message) => {
        this.successMessage = message;
      }
    );
  }

  /**
   * Imports the wallet based on the current key store parameters.
   * 
   * After the wallet is imported the app will navigate back to its origin.
   */
  import(): Promise<void> {
    if(this.dataIsValid()) {
      let wallet = this.prepareWallet();
      if(wallet == null) {
        this.passwordIsInvalid = true;
        return;
      }

      return this.walletService.store(wallet).then(
        () => {
          this.toastController.create({
            message: this.successMessage,
            duration: 1500,
            position: "top"
          }).present();

          this.goBackToOriginPage();
        },
        (error) => {
          // Could not store wallet, what do?
        }
      );
    }
    else {
      return Promise.reject("Data is not valid for import");
    }
  }

  /**
   * Prepares the wallet based on the current key store, password and name entered by the user.
   */
  prepareWallet(): ILocalWallet {
    // Get the decrypted private key. We need this to retrieve the public key for the wallet.
    let privateKey = this.keyStoreService.decryptKeyStore(this.keyStore, this.password);
    if(privateKey == null)
      return null;

    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      type: "local",
      name: this.name,
      publicKey: this.cryptoKeyService.generatePublicKey(privateKey),
      keyStore: this.keyStore,
      transactions: [],
      lastUpdateTime: null
    };

    return wallet;
  }

  /**
   * Navigates back to the page the user originally came from.
   */
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
   * Returns true if the data entered by the user is valid.
   */
  dataIsValid(): boolean {
    return this.name.length > 0 && 
           this.keyStoreString.length > 0 && 
           !this.keyStoreIsInvalid;
  }

  /**
   * Called when the key store text area was changed by the user.
   * 
   * This function will determine if the key store pasted by the user appears valid.
   */
  onKeyStoreChanged() {
    if(this.keyStoreString.length == 0) {
      this.keyStoreIsInvalid = false;
      return;
    }

    // We assume the key store is invalid. If all checks succeed we flip this variable to true.
    this.keyStoreIsInvalid = true;

    // First try and parse the key store as JSON
    let testKeyStore: IKeyStore;
    try {
      testKeyStore = JSON.parse(this.keyStoreString);
    }
    catch(ex) {
      // Not valid JSON
      return;
    }

    // Run some quick checks to see if all required properties are available
    if(testKeyStore.cipher != "AES-CTR")
      return;

    if(!testKeyStore.cipherParams)
      return;

    if(!this.isDefinedAndFilledString(testKeyStore.cipherParams.iv))
      return;

    if(!this.isDefinedAndFilledString(testKeyStore.cipherText))
      return;

    if(!testKeyStore.keyParams)
      return;

    if(!this.isDefinedAndFilledString(testKeyStore.keyParams.salt))
      return;

    if(!this.isNumber(testKeyStore.keyParams.iterations))
      return;

    if(!this.isNumber(testKeyStore.keyParams.keySize))
      return;

    if(!this.isDefinedAndFilledString(testKeyStore.controlHash))
      return;

    this.keyStore = testKeyStore;
    this.keyStoreIsInvalid = false;
  }

  /**
   * Returns true if the type of the given data is a number.
   * @param value 
   */
  isNumber(value: any): boolean {
    return typeof(value) == "number";
  }

  /**
   * Returns true if the given data satisfies all of the below conditions:
   * - It is not null and not undefined
   * - It is a string
   * - It has a length greater than zero.
   * @param value 
   */
  isDefinedAndFilledString(value: any): boolean {
    if(!value)
      return false;

    if(typeof(value) != "string")
      return false;

    if(value.length == 0)
      return false;

    return true;
  }

}
