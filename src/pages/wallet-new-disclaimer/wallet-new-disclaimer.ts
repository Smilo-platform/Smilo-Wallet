import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";
import { HomePage } from "../home/home";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private cryptoKeyService: CryptoKeyService,
              private walletService: WalletService,
              private keyStoreService: KeyStoreService) {
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

  goToPrepareWalletPage(wallet: ILocalWallet, password: string) {
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
  prepareWallet(): ILocalWallet {
    let keyPair = this.cryptoKeyService.generateKeyPair(this.passphrase.join(" "));

    let wallet: ILocalWallet = {
      id: this.walletService.generateId(),
      type: "local",
      name: this.walletName,
      publicKey: keyPair.publicKey,
      keyStore: this.keyStoreService.createKeyStore(keyPair.privateKey, this.password),
      transactions: [],
      lastUpdateTime: new Date(),
      balances: []
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
