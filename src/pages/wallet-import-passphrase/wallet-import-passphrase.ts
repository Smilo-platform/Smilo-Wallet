import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PasswordService, IPasswordValidationResult } from "../../services/password-service/password-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { BIP39Service, IPassphraseValidationResult } from "../../services/bip39-service/bip39-service";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { BIP32Service } from "../../services/bip32-service/bip32-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { WalletIndexValidator } from "../../validators/WalletIndexValidator";

@IonicPage()
@Component({
  selector: "page-wallet-import-passphrase",
  templateUrl: "wallet-import-passphrase.html",
})
export class WalletImportPassphrasePage {
  passphrase: string = "";
  password: string = "";
  passwordConfirm: string = "";
  walletName: string = "";

  passphraseStatus: IPassphraseValidationResult;
  passwordStatus: IPasswordValidationResult;

  showAdvanced: boolean = false;

  walletIndex: number = 0;

  form: FormGroup;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private passwordService: PasswordService,
              private walletService: WalletService,
              private keyStoreService: KeyStoreService,
              private bip32Service: BIP32Service,
              private bip39Service: BIP39Service,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      passphrase: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
      passwordConfirm: ["", Validators.compose([Validators.required])],
      walletName: ["", Validators.compose([Validators.required])],
      walletIndex: ["", Validators.compose([WalletIndexValidator()])]
    });
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
    return this.passwordStatus &&
           this.passwordStatus.type == "success" &&
           this.passphraseStatus &&
           this.form.valid && 
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
    let privateKey = this.bip32Service.getPrivateKey(seed, this.walletIndex);

    // Create key store for private key
    let keyStore = this.keyStoreService.createKeyStore(privateKey, this.password);

    // Prepare wallet
    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      name: this.walletName,
      type: "local",
      publicKey: null,
      keyStore: keyStore,
      lastUpdateTime: null
    };

    return wallet;
  }
}
