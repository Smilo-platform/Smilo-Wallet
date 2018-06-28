import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { IKeyStore } from "../../models/IKeyStore";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";

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
  clipBoardKeyStoreIsInvalid: boolean = false;
  /**
   * Set to true if the keystore could not be decrypted with the password.
   */
  clipboardPasswordIsInvalid: boolean = false;
  filePasswordIsInvalid: boolean = false;
  fileKeystoreIsInvalidNameExtension: boolean = false;
  fileKeystoreInvalidData: boolean = false;
  fileImportedName: string = "";
  filePassword: string = "";
  fileWalletNameImport: string = "";

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private keyStoreService: KeyStoreService) {

  }

  canShowClipboardPasswordInput(): boolean {
    return this.keyStoreString.length > 0 && !this.clipBoardKeyStoreIsInvalid;
  }

  canShowClipboardWalletNameInput(): boolean {
    return this.canShowClipboardPasswordInput() && this.password.length > 0
  }

  canShowFileChooseImportButton(): boolean { 
    return this.fileImportedName.length === 0;
  }

  canShowFilePasswordInputAndImportedName(): boolean { 
    return this.fileImportedName.length > 0;
  }

  canShowFileImportNameInput(): boolean { 
    return this.canShowFilePasswordInputAndImportedName() && this.filePassword.length > 0;
  }

  canShowFileImportButton(): boolean {
    return this.canShowFileImportNameInput() && this.fileWalletNameImport.length > 0;
  }

  importByClipboard(): Promise<void> {
    if (this.clipboardDataIsValid()) {
      return this.importWalletByCurrentKeystoreInfo("clipboard");
    } else {
      return Promise.reject("Keystore not valid");
    }
  }

  importByFile(): Promise<void> {
    if (this.keystoreFileDataIsValid()) {
      return this.importWalletByCurrentKeystoreInfo("file");
    } else {
      return Promise.reject("Keystore not valid");
    }
  }

  /**
   * Imports the wallet based on the current key store parameters.
   * 
   * After the wallet is imported the app will navigate back to its origin.
   */
  importWalletByCurrentKeystoreInfo(type: ImportType): Promise<void> {
    let wallet = this.prepareWallet(type);
    if(wallet === null) {
      if (type === "clipboard") {
        this.clipboardPasswordIsInvalid = true;
      } else if (type === "file") {
        this.filePasswordIsInvalid = true;
      }
      return Promise.resolve();
    } else {
      return this.goToPrepareWalletPage(wallet, this.password);
    }
  }

  goToPrepareWalletPage(wallet: ILocalWallet, password: string): Promise<void> {
    let params = {
      wallet: wallet,
      password: password
    };
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    return this.navCtrl.push(PrepareWalletPage, params);
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
      password = this.filePassword;
      name = this.fileWalletNameImport;
    }
    let privateKey = this.keyStoreService.decryptKeyStore(this.keyStore, password);
    if(privateKey == null)
      return null;

    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      type: "local",
      name: name,
      publicKey: null,
      keyStore: this.keyStore,
      lastUpdateTime: null,
    };

    return wallet;
  }

  resetCurrentKeystoreFile() {
    this.clipboardPasswordIsInvalid = false;
    this.filePasswordIsInvalid = false;
    this.fileKeystoreIsInvalidNameExtension = false;
    this.fileKeystoreInvalidData = false;
    this.fileImportedName = "";
    this.filePassword = "";
    this.fileWalletNameImport = "";
  }

  /**
   * Returns true if the data entered by the user is valid.
   */
  clipboardDataIsValid(): boolean {
    return this.name.length > 0 && 
           this.keyStoreString.length > 0 && 
           !this.clipBoardKeyStoreIsInvalid;
  }

  keystoreFileDataIsValid(): boolean {
    return !this.fileKeystoreInvalidData &&
           !this.fileKeystoreIsInvalidNameExtension
  }

  /**
   * Called when the key store text area was changed by the user.
   * 
   * This function will determine if the key store pasted by the user appears valid.
   */
  onKeyStoreChanged() {
    if(this.keyStoreString.length == 0) {
      this.clipBoardKeyStoreIsInvalid = false;
      return;
    }

    // We assume the key store is invalid. If all checks succeed we flip this variable to true.
    this.clipBoardKeyStoreIsInvalid = true;

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
    this.clipBoardKeyStoreIsInvalid = false;
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

  /**
   * This method is called when the user clicks the import button to import a keystore file
   */
  importKeystoreFile(): void {
    // When clicking the button create an input element
    var input = document.createElement('input');
    // With type file so the browser understands the file browser should be opened on click
    input.type = 'file';
    // Click it as if the user clicked the generated input 
    input.click();
    // When the user has selected a file in the file browser
    input.onchange = (e) => {
      // Cast the target to any type so we can access the files array
      let target: any = event.target;
      // Get the first selected file (we should only get one)
      let file: File = target.files[0];
      // Get the file type
      let type = file.type;
      // Get the file name
      let filename = file.name;
      // Get the first five characters of the file name
      let startChars = file.name.substring(0, 5);
      // The type should be empty (no extension) and the file should start with UTC--
      if (type === "" && startChars === "UTC--") {
        // So the type and start of the name is correct
        this.fileKeystoreIsInvalidNameExtension = false;
        // Read the text from the blob
        this.readInputFromBlob(file, filename);
      // So the type or start of the file is not correct  
      } else {
        // Set to true so we can show in the UI
        this.fileKeystoreIsInvalidNameExtension = true;
      }
    }
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
            this.fileImportedName = filename;
          } else {
            this.fileKeystoreInvalidData = true;
          }
        } catch (exception) {
          this.fileKeystoreInvalidData = true;
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