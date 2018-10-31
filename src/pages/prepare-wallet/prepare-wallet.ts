import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, ModalController } from "ionic-angular";
import { MerkleTreeService } from "../../services/merkle-tree-service/merkle-tree-service";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { HomePage } from "../home/home";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { TranslateService } from "@ngx-translate/core";
import { WalletErrorPage } from "../wallet-error/wallet-error";
import { Platform } from "ionic-angular/platform/platform";
import { WalletExtraImportPage, IWalletExtraImportDismissData } from "../wallet-extra-import/wallet-extra-import";
import { ThemeType, SettingsService } from "../../services/settings-service/settings-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

@IonicPage()
@Component({
  selector: "page-prepare-wallet",
  templateUrl: "prepare-wallet.html",
})
export class PrepareWalletPage {
  wallet: Smilo.ILocalWallet;
  password: string;

  progress: number = 0;

  statusMessages: string[] = [
    "prepare_wallet.status1",
    "prepare_wallet.status2",
    "prepare_wallet.status3",
    "prepare_wallet.status4",
    "prepare_wallet.status5",
    "prepare_wallet.status6",
    "prepare_wallet.status7"
  ];
  activeStatusMessageIndex: number = 0;

  /**
   * The translated message to shown when the importing succeeded.
   */
  successMessage: string;

  /**
   * The passphrase used to generate this wallet.
   * 
   * This property is optionally set via the NavParams service.
   * 
   * If it is set together with the walletIndex property a prompt
   * will be shown to the user after the Merkle Tree was generated asking
   * the user if he/she wants to import another wallet.
   */
  passphrase: string;
  /**
   * The BIP44 address index used to generate this wallet.
   * 
   * This property is optionally set via the NavParams service.
   * 
   * If it is set together with the passphrase property a prompt
   * will be shown to the user after the Merkle Tree was generated asking
   * the user if he/she wants to import another wallet.
   */
  walletIndex: number;

  unregisterBackButtonAction: Function;

  selectedTheme: ThemeType;

  private encryptionHelper = new Smilo.EncryptionHelper();
  private bip39 = new Smilo.BIP39();
  private bip32 = new Smilo.BIP32();

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private merkleTreeService: MerkleTreeService,
              private navigationHelperService: NavigationHelperService,
              private walletService: WalletService,
              private translateService: TranslateService,
              private toastController: ToastController,
              private modalController: ModalController,
              private platform: Platform,
              private settingsService: SettingsService) {
    
  }

  ionViewDidLoad() {
    this.initialize();

    // Register for the back button action. On iOS this will simply never get called.
    // The returned value is a function we can call to unregister for the back button.
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(this.onBackButtonClicked, 101);
  }

  ngOnInit(): void {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewDidLeave() {
    // Unregister the back button action to allow the use of the back button again.
    this.unregisterBackButtonAction();
  }

  onBackButtonClicked = () => {
    // We simply do nothing!
  }

  initialize() {
    this.wallet = this.navParams.get("wallet");
    this.password = this.navParams.get("password");
    this.passphrase = this.navParams.get("passphrase");
    this.walletIndex = this.navParams.get("walletIndex");

    this.translateService.get("prepare_wallet.toast.success").subscribe(
      (message) => {
        this.successMessage = message;
      }
    );

    // Wait 500ms to allow the view to properly animate.
    setTimeout(() => {
      this.generateMerkleTree();
    }, 500);
  }

  generateMerkleTree(): Promise<void> {
    this.progress = 0;
    this.activeStatusMessageIndex = 0;
    
    return this.merkleTreeService.generate(this.wallet, this.password, this.onProgressUpdate).then(
      this.onMerkleTreeGenerated,
      this.onMerkleTreeFailed
    );
  }

  onProgressUpdate = (progress: number) => {
    if(progress < 0)
      progress = 0;
    else if(progress > 1)
      progress = 1;

    let progressPerUpdate = 1 / this.statusMessages.length;

    this.progress = Math.round(progress * 100);

    this.activeStatusMessageIndex = Math.floor(progress / progressPerUpdate);
    if(this.activeStatusMessageIndex >= this.statusMessages.length)
      this.activeStatusMessageIndex = this.statusMessages.length - 1;
  }

  onMerkleTreeGenerated = () => {
    return this.merkleTreeService.get(this.wallet, this.password).then(
      (merkleTree) => {
        // Store the public key
        this.wallet.publicKey = merkleTree.getPublicKey();

        // Store the wallet
        return this.walletService.store(this.wallet).then(
          () => {
            this.toastController.create({
              message: this.successMessage,
              duration: 1500,
              position: "top"
            }).present();

            return this.finalize();
          },
          (error) => {
            // Failed to store wallet...what do?
            console.error(error);
          }
        );
      }
    );
  }

  onMerkleTreeFailed = (error) => {
    // Display error, after user goes back to origin page.
    let modal = this.modalController.create(WalletErrorPage, {
      error: error.message ? error.message : error.toString()
    }, {
      enableBackdropDismiss: false
    });

    modal.present();

    modal.onDidDismiss(() => {
      this.goBackToOriginPage();
    });
  }

  /**
   * Finalizes this page after the Merkle Tree was generated.
   * 
   * If a passphrase and wallet index are defined the user will be asked
   * if he/she wishes to import another wallet. Otherwise (or if the user declines)
   * the wallet will navigate back to the origin page.
   */
  finalize(): Promise<void> {
    let promptPromise = Promise.resolve<IWalletExtraImportDismissData>({importExtra: false});

    if(this.passphrase && this.walletIndex !== undefined) {
      // Set promise to a modal promise
      let modal = this.modalController.create(WalletExtraImportPage, {
        nextIndex: this.walletIndex + 1
      }, {
        enableBackdropDismiss: false,
        cssClass: this.selectedTheme
      });

      promptPromise = new Promise((resolve, reject) => {
        modal.onDidDismiss((data) => {
          resolve(data);
        });

        modal.present();
      });
    }
    
    return promptPromise.then(
      (data) => {
        if(data.importExtra) {
          this.wallet = this.prepareWallet(data.name, data.index);
          this.walletIndex = data.index;
          
          return this.generateMerkleTree();
        }
        else {
          return this.goBackToOriginPage();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  prepareWallet(walletName: string, walletIndex: number): Smilo.ILocalWallet {
    let seed = this.bip39.toSeed(this.passphrase);
    let privateKey = this.bip32.getPrivateKey(seed, walletIndex);

    // Create key store for private key
    let keyStore = this.encryptionHelper.createKeyStore(privateKey, this.password);

    // Prepare wallet
    let wallet: Smilo.ILocalWallet = {
      id: this.walletService.generateId(),
      name: walletName,
      type: "local",
      publicKey: null,
      keyStore: keyStore,
      lastUpdateTime: null
    };

    return wallet;
  }

  goBackToOriginPage() {
    switch(<NavigationOrigin>this.navParams.get(NAVIGATION_ORIGIN_KEY) || "landing") {
      case("landing"):
        this.navCtrl.setRoot(HomePage);
        break;
      case("home"):
        this.navigationHelperService.navigateBack(this.navCtrl, 4);
        break;
      case("wallet_overview"):
        this.navigationHelperService.navigateBack(this.navCtrl, 4);
        break;
    }
  }

}
