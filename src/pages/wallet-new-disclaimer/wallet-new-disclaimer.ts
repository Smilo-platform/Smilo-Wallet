import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";
import { KeyStoreService } from "../../services/key-store-service/key-store-service";

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

      return this.walletService.store(wallet).then(
        () => {
          // Wallet created! Now navigate to the wallet overview page.
          this.navCtrl.setRoot(WalletOverviewPage);
        },
        (error) => {
          // Something went wrong when creating the wallet...
          // We need to do some proper error handling here...
        }
      );
    }
    else {
      return Promise.resolve();
    }
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
