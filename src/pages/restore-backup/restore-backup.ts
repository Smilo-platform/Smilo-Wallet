import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PasswordService, IPasswordValidationResult } from "../../services/password-service/password-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { BIP39Service, IPassphraseValidationResult } from "../../services/bip39-service/bip39-service";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { BIP32Service } from "../../services/bip32-service/bip32-service";

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

  passphraseStatus: IPassphraseValidationResult;
  passwordStatus: IPasswordValidationResult;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private passwordService: PasswordService,
              private walletService: WalletService,
              private keyStoreService: KeyStoreService,
              private bip32Service: BIP32Service,
              private bip39Service: BIP39Service) {
  }

  onPasswordChanged() {
    this.passwordStatus = this.passwordService.validate(this.password, this.passwordConfirm);
  }

  onPassphraseChanged(): Promise<void> {
    return this.bip39Service.check(this.passphrase).then(
      (valid) => {
        this.passphraseStatus = valid;
      }
    );
  }

  dataIsValid(): boolean {
    return this.passphrase.length > 0 &&
           this.password.length > 0 &&
           this.walletName.length > 0 &&
           this.passwordStatus &&
           this.passwordStatus.type == "success" &&
           this.passphraseStatus &&
           (this.passphraseStatus.isValid || !this.passphraseStatus.isBlocking);
  }
  
  import(): Promise<void> {
    let wallet = this.prepareWallet();

    return this.goToPrepareWalletPage(wallet, this.password);
  }

  goToPrepareWalletPage(wallet: ILocalWallet, password: string): Promise<void> {
    let params = {
      wallet: wallet,
      password: password
    };
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    return this.navCtrl.push(PrepareWalletPage, params);
  }

  prepareWallet(): ILocalWallet {
    let seed = this.bip39Service.toSeed(this.passphrase);
    let privateKey = this.bip32Service.getPrivateKey(seed);

    // Create key store for private key
    let keyStore = this.keyStoreService.createKeyStore(privateKey, this.password);

    // Prepare wallet
    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      name: this.walletName,
      type: "local",
      publicKey: null,
      keyStore: keyStore,
      transactions: [],
      lastUpdateTime: null,
      balances: []
    };

    return wallet;
  }
}
