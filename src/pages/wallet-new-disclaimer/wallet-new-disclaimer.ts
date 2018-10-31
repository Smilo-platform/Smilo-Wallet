import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

@IonicPage()
@Component({
  selector: "page-wallet-new-disclaimer",
  templateUrl: "wallet-new-disclaimer.html",
})
export class WalletNewDisclaimerPage {

  agreedToTerm1: boolean = false;
  agreedToTerm2: boolean = false;
  agreedToTerm3: boolean = false;
  agreedToTerm4: boolean = false;

  passphrase: string[];
  password: string;

  walletName: string = "";

  private encryptionHelper = new Smilo.EncryptionHelper();
  private bip39 = new Smilo.BIP39();
  private bip32 = new Smilo.BIP32();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private walletService: WalletService) {
    this.passphrase = this.navParams.get("passphrase");
    this.password = this.navParams.get("password");
  }

  finish(): Promise<void> {
    if(this.canShowFinishButton()) {
      // Do final steps to create the wallet, then go to wallet overview page.
      let wallet = this.prepareWallet();

      return this.goToPrepareWalletPage(wallet, this.password);
    }
    else {
      return Promise.resolve();
    }
  }

  goToPrepareWalletPage(wallet: Smilo.ILocalWallet, password: string) {
    let params = {
      wallet: wallet,
      password: password
    };
    params[NAVIGATION_ORIGIN_KEY] = this.navParams.get(NAVIGATION_ORIGIN_KEY);

    return this.navCtrl.push(PrepareWalletPage, params);
  }

  /**
   * Prepares and returns the wallet based on the current passphrase and password.
   */
  prepareWallet(): Smilo.ILocalWallet {
    let seed = this.bip39.toSeed(this.passphrase.join(" "));
    let privateKey = this.bip32.getPrivateKey(seed);

    let wallet: Smilo.ILocalWallet = {
      id: this.walletService.generateId(),
      type: "local",
      name: this.walletName,
      publicKey: null,
      keyStore: this.encryptionHelper.createKeyStore(privateKey, this.password),
      lastUpdateTime: new Date()
    };

    return wallet;
  }

  /**
   * Returns true if the user accepted all terms and entered a wallet name.
   */
  canShowFinishButton(): boolean {
    return this.agreedToTerm1 &&
           this.agreedToTerm2 &&
           this.agreedToTerm3 &&
           this.agreedToTerm4 &&
           this.walletName.length > 0;
  }

}
