import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PrepareWalletPage } from "./prepare-wallet";
import { IonicModule, NavController, NavParams, ToastController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { INavigationHelperService, NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { MerkleTreeService } from "../../services/merkle-tree-service/merkle-tree-service";
import { HomePage } from "../home/home";

describe("PrepareWalletPage", () => {
  let comp: PrepareWalletPage;
  let fixture: ComponentFixture<PrepareWalletPage>;
  let walletService: IWalletService;
  let navController: MockNavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;
  let merkleTreeService: MockMerkleTreeService;
  let toastController: MockToastController;

  beforeEach(async(() => {
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();
    merkleTreeService = new MockMerkleTreeService();
    toastController = new MockToastController();

    TestBed.configureTestingModule({
      declarations: [PrepareWalletPage],
      imports: [
        IonicModule.forRoot(PrepareWalletPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: WalletService, useValue: walletService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: ToastController, useValue: toastController },
        { provide: MerkleTreeService, useValue: merkleTreeService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareWalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should navigate back correctly when the origin page is 'landing'", () => {
    // Mock navParams.get
    spyOn(navParams, "get").and.callFake((key) => "landing");

    spyOn(navController, "setRoot");
    
    comp.goBackToOriginPage();

    expect(navController.setRoot).toHaveBeenCalledWith(HomePage);
  });

  it("should navigate back correctly when the origin page is 'home'", () => {
    // Mock navParams.get
    spyOn(navParams, "get").and.callFake((key) => "home");

    spyOn(navigationHelperService, "navigateBack");
    
    comp.goBackToOriginPage();

    expect(navigationHelperService.navigateBack).toHaveBeenCalledWith(navController, 4);
  });

  it("should navigate back correctly when the origin page is 'wallet_overview'", () => {
    // Mock navParams.get
    spyOn(navParams, "get").and.callFake((key) => "wallet_overview");

    spyOn(navigationHelperService, "navigateBack");
    
    comp.goBackToOriginPage();

    expect(navigationHelperService.navigateBack).toHaveBeenCalledWith(navController, 4);
  });
});