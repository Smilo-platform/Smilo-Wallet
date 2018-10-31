import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PasswordService, IPasswordValidationResult } from "../../services/password-service/password-service";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { WalletIndexValidator } from "../../validators/WalletIndexValidator";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

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

  passphraseStatus: Smilo.IPassphraseValidationResult;
  passwordStatus: IPasswordValidationResult;

  showAdvanced: boolean = false;

  walletIndex: number = 0;

  form: FormGroup;

  private bip39: Smilo.BIP39 = new Smilo.BIP39();
  private bip32: Smilo.BIP32 = new Smilo.BIP32();

  private encryptionHelper = new Smilo.EncryptionHelper();

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private passwordService: PasswordService,
              private walletService: WalletService,
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

  onPassphraseChanged() {
    if (this.passphrase.length > 0) {
      this.passphraseStatus = this.bip39.check(this.passphrase);
    } else {
      this.passphraseStatus = undefined;
    }
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

  goToPrepareWalletPage(wallet: Smilo.ILocalWallet, password: string): Promise<void> {
    let params = {
      wallet: wallet,
      password: password,
      passphrase: this.passphrase,
      walletIndex: this.walletIndex
    };
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    return this.navCtrl.push(PrepareWalletPage, params);
  }

  prepareWallet(): Smilo.ILocalWallet {
    let seed = this.bip39.toSeed(this.passphrase);
    let privateKey = this.bip32.getPrivateKey(seed, this.walletIndex);

    // Create key store for private key
    let keyStore = this.encryptionHelper.createKeyStore(privateKey, this.password);

    // Prepare wallet
    let wallet: Smilo.ILocalWallet = {
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
