import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, Platform } from "ionic-angular";
import { IKeyStore } from "../../models/IKeyStore";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { HomePage } from "../home/home";
import { TranslateService } from "@ngx-translate/core";
import { FileChooser } from "@ionic-native/file-chooser";
import { platform } from "os";
import { IOSFilePicker } from '@ionic-native/file-picker';

export declare type ImportType = "clipboard" | "file";

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
  filePasswordIsInvalid: boolean = false;
  keystoreFileIsInvalid: boolean = false;
  keystoreFileInvalidData: boolean = false;
  importedFilename: string = "";
  passwordFile: string = "";
  walletNameFileImport: string = "";

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
              private translateService: TranslateService,
              private fileChooser: FileChooser,
              private platform: Platform,
              private filePicker: IOSFilePicker) {
    this.translateService.get("import_keystore.toast.success").subscribe(
      (message) => {
        this.successMessage = message;
      }
    );
  }

  canShowClipboardPasswordInput(): boolean {
    return this.keyStoreString.length > 0 && !this.keyStoreIsInvalid;
  }

  canShowClipboardWalletNameInput(): boolean {
    return this.canShowClipboardPasswordInput() && this.password.length > 0
  }

  canShowFileChooseImportButton(): boolean { 
    return this.importedFilename.length === 0;
  }

  canShowFilePasswordInputAndImportedName(): boolean { 
    return this.importedFilename.length > 0;
  }

  canShowFileImportNameInput(): boolean { 
    return this.canShowFilePasswordInputAndImportedName() && this.passwordFile.length > 0;
  }

  canShowFileImportButton(): boolean {
    return this.canShowFileImportNameInput() && this.walletNameFileImport.length > 0;
  }

  importByClipboard() {
    if (this.clipboardDataIsValid()) {
      this.importWalletByCurrentKeystoreInfo("clipboard");
    }
  }

  importByFile() {
    if (this.keystoreFileDataIsValid()) {
      this.importWalletByCurrentKeystoreInfo("file");
    }
  }

  /**
   * Imports the wallet based on the current key store parameters.
   * 
   * After the wallet is imported the app will navigate back to its origin.
   */
  importWalletByCurrentKeystoreInfo(type: ImportType): Promise<void> {
    let wallet = this.prepareWallet(type);
    if(wallet == null) {
      if (type === "clipboard") {
        this.passwordIsInvalid = true;
      } else if (type === "file") {
        this.filePasswordIsInvalid = true;
      }
      return Promise.resolve();
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

  /**
   * Prepares the wallet based on the current key store, password and name entered by the user.
   */
  prepareWallet(type: ImportType): ILocalWallet {
    // Get the decrypted private key. We need this to retrieve the public key for the wallet.
    let password = "";
    let name = "";
    if (type === "clipboard") {
      password = this.password;
      name = this.name;
    } else if (type === "file") {
      password = this.passwordFile;
      name = this.walletNameFileImport;
    }
    let privateKey = this.keyStoreService.decryptKeyStore(this.keyStore, password);
    if(privateKey == null)
      return null;

    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      type: "local",
      name: name,
      publicKey: this.cryptoKeyService.generatePublicKey(privateKey),
      keyStore: this.keyStore,
      transactions: [],
      lastUpdateTime: null,
      balances: []
    };

    return wallet;
  }

  resetCurrentKeystoreFile() {
    this.passwordIsInvalid = false;
    this.filePasswordIsInvalid = false;
    this.keystoreFileIsInvalid = false;
    this.keystoreFileInvalidData = false;
    this.importedFilename = "";
    this.passwordFile = "";
    this.walletNameFileImport = "";
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
  clipboardDataIsValid(): boolean {
    return this.name.length > 0 && 
           this.keyStoreString.length > 0 && 
           !this.keyStoreIsInvalid;
  }

  keystoreFileDataIsValid(): boolean {
    return !this.keystoreFileInvalidData &&
           !this.keystoreFileIsInvalid
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
    if(!this.isValidKeyStore(testKeyStore))
      return;

    this.keyStore = testKeyStore;
    this.keyStoreIsInvalid = false;
  }

  isValidKeyStore(keyStore: IKeyStore): boolean {
    if(keyStore.cipher != "AES-CTR")
      return false;

    if(!keyStore.cipherParams)
      return false;

    if(!this.isDefinedAndFilledString(keyStore.cipherParams.iv))
      return false;

    if(!this.isDefinedAndFilledString(keyStore.cipherText))
      return false;

    if(!keyStore.keyParams)
      return false;

    if(!this.isDefinedAndFilledString(keyStore.keyParams.salt))
      return false;

    if(!this.isNumber(keyStore.keyParams.iterations))
      return false;

    if(!this.isNumber(keyStore.keyParams.keySize))
      return false;

    if(!this.isDefinedAndFilledString(keyStore.controlHash))
      return false;

    return true;
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

  importKeystoreFile() {
    // if (this.platform.is("ios")) {
    //   this.filePicker.pickFile()
    //     .then(uri => this.readInputFromBlob(this.dataURItoBlob(uri), "FILENAME"))
    //     .catch(err => console.log('Error', err));
    // } else if (this.platform.is("android")) {
      this.fileChooser.open()
        .then(uri => this.readInputFromBlob(this.dataURItoBlob(uri), "FILENAME"))
        .catch(e => console.log(e));
    // } else {
    //   var input = document.createElement('input');
    //   input.type = 'file';
    //   input.click();
    //   input.onchange = (e) => {
    //     let target: any = event.target;
    //     let file: File = target.files[0];
    //     let type = file.type;
    //     let filename = file.name;
    //     let startChars = file.name.substring(0, 5);
    //     console.log(filename);
    //     if (type === "" && startChars === "UTC--") {
    //       this.keystoreFileIsInvalid = false;
    //       this.readInputFromBlob(file, filename);
    //     } else {
    //       this.keystoreFileIsInvalid = true;
    //     }
    //   }
    // }
  }

  readInputFromBlob(uri: Blob, filename: string) {
    const reader = new FileReader();
    reader.onload = (event) => {
        let target: any = event.target;
        let file: string = target.result;
        const allLines = file.split(/\r\n|\n/);
        try {
          let keyStore = JSON.parse(allLines[0]) as IKeyStore;
          if (this.isValidKeyStore(keyStore)) {
            this.keyStore = keyStore;
            this.importedFilename = filename;
          } else {
            this.keystoreFileInvalidData = true;
          }
        } catch (exception) {
          this.keystoreFileInvalidData = true;
        }
    };
    reader.readAsText(uri);
  }

  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }
}