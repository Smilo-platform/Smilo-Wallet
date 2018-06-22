import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ILocalWallet } from "../../models/ILocalWallet";
import { MerkleTree } from "../../merkle/MerkleTree";
import { MerkleTreeService } from "../../services/merkle-tree-service/merkle-tree-service";
import { NavigationOrigin, NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { HomePage } from "../home/home";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-prepare-wallet",
  templateUrl: "prepare-wallet.html",
})
export class PrepareWalletPage {
  wallet: ILocalWallet;
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

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private merkleTreeService: MerkleTreeService,
              private navigationHelperService: NavigationHelperService,
              private walletService: WalletService) {
    this.wallet = navParams.get("wallet");
    this.password = navParams.get("password");
  }

  ionViewDidLoad() {
    // Wait 500ms to allow the view to properly animate.
    setTimeout(() => {
      this.generateMerkleTree();
    }, 500);
  }

  generateMerkleTree() {
    this.merkleTreeService.generate(this.wallet, this.password, this.onProgressUpdate).then(
      this.onMerkleTreeGenerated,
      this.onMerkleTreeFailed
    );
  }

  onProgressUpdate = (progress: number) => {
    let progressPerUpdate = 1 / this.statusMessages.length;

    this.progress = Math.round(progress * 100);

    this.activeStatusMessageIndex = Math.floor(progress / progressPerUpdate);
    if(this.activeStatusMessageIndex >= this.statusMessages.length)
      this.activeStatusMessageIndex = this.statusMessages.length - 1;
  }

  onMerkleTreeGenerated = () => {
    return this.walletService.store(this.wallet).then(
      () => {
        return this.goBackToOriginPage();
      },
      (error) => {
        // Failed to store wallet...what do?
      }
    );
  }

  onMerkleTreeFailed = (error) => {
    // Display error, after user goes back to origin page.
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
