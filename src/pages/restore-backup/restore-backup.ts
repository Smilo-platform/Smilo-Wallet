import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PasswordService, IPasswordValidationResult } from "../../services/password-service/password-service";
import { PassphraseService } from "../../services/passphrase-service/passphrase-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { HomePage } from "../home/home";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";

@IonicPage()
@Component({
  selector: "page-restore-backup",
  templateUrl: "restore-backup.html",
})
export class RestoreBackupPage {

  passphrase: string = "";
  password: string = "";
  passwordConfirm: string = "";
  walletName: string = "";

  passphraseIsValid: boolean = true;
  passwordStatus: IPasswordValidationResult;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private passwordService: PasswordService,
              private passphraseService: PassphraseService,
              private walletService: WalletService,
              private cryptoKeyService: CryptoKeyService,
              private keyStoreService: KeyStoreService,
              private navigationHelperService: NavigationHelperService) {
  }

  onPasswordChanged() {
    this.passwordStatus = this.passwordService.validate(this.password, this.passwordConfirm);
  }

  onPassphraseChanged() {
    this.passphraseIsValid = this.passphraseService.isValid(this.passphrase, 12);
  }

  dataIsValid(): boolean {
    return this.passphrase.length > 0 &&
           this.password.length > 0 &&
           this.walletName.length > 0 &&
           this.passwordStatus &&
           this.passwordStatus.type == "success" &&
           this.passphraseIsValid;
  }
  
  import(): Promise<void> {
    let wallet = this.prepareWallet();

    return this.walletService.store(wallet).then(
      () => {
        this.goBackToOriginPage();
      },
      (error) => {
        // TODO: Handle errors here
      }
    );
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

  prepareWallet(): ILocalWallet {
    // Generate key pair from passphrase
    let keyPair = this.cryptoKeyService.generateKeyPair(
      this.passphraseService.passphraseStringToWords(this.passphrase)
    );

    // Create key store for private key
    let keyStore = this.keyStoreService.createKeyStore(keyPair.privateKey, this.password);

    // Prepare wallet
    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      name: this.walletName,
      type: "local",
      publicKey: keyPair.publicKey,
      keyStore: keyStore,
      transactions: [],
      lastUpdateTime: null
    };

    return wallet;
  }
}
