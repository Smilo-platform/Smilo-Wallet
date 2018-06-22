import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PrepareWalletPage } from "./prepare-wallet";
import { IonicModule, NavController, NavParams, ToastController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { INavigationHelperService, NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { MerkleTreeService } from "../../services/merkle-tree-service/merkle-tree-service";
import { HomePage } from "../home/home";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockToast } from "../../../test-config/mocks/MockToast";

describe("PrepareWalletPage", () => {
  let comp: PrepareWalletPage;
  let fixture: ComponentFixture<PrepareWalletPage>;
  let walletService: IWalletService;
  let navController: MockNavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;
  let merkleTreeService: MockMerkleTreeService;
  let toastController: MockToastController;
  let translateService: MockTranslateService;

  beforeEach(async(() => {
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();
    merkleTreeService = new MockMerkleTreeService();
    toastController = new MockToastController();
    translateService = new MockTranslateService();

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
        { provide: MerkleTreeService, useValue: merkleTreeService },
        { provide: TranslateService, useValue: translateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareWalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    let dummyWallet = {};
    spyOn(navParams, "get").and.callFake((key) => {
      if(key == "wallet")
        return dummyWallet;
      else if(key == "password")
        return "pass123"
    });

    spyOn(window, "setTimeout").and.callFake((callback, time) => {
      expect(time).toBe(500);

      callback();
    });

    spyOn(comp, "generateMerkleTree");

    comp.initialize();

    expect(comp.wallet).toBe(<any>dummyWallet);
    expect(comp.password).toBe("pass123");
    expect(comp.successMessage).toBe("prepare_wallet.toast.success");
    expect(comp.generateMerkleTree).toHaveBeenCalled();
  });

  it("should start generating the merkle tree correctly", () => {
    let dummyWallet = {};
    comp.wallet = <any>dummyWallet;
    comp.password = "pass123";

    spyOn(merkleTreeService, "generate").and.returnValue(Promise.resolve());

    comp.generateMerkleTree();

    expect(merkleTreeService.generate).toHaveBeenCalledWith(dummyWallet, "pass123", comp.onProgressUpdate);
  });

  it("should call the correct handler when the merkle tree was succesfully generated", (done) => {
      let dummyWallet = {};
    comp.wallet = <any>dummyWallet;
    comp.password = "pass123";

    spyOn(merkleTreeService, "generate").and.returnValue(Promise.resolve());
    spyOn(comp, "onMerkleTreeGenerated");

    comp.generateMerkleTree().then(
      () => {
        expect(comp.onMerkleTreeGenerated).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "promise reject should not be called");

        done();
      }
    );
  });

  it("should call the correct handle when the merke tree failed to generate", (done) => {
    let dummyWallet = {};
    comp.wallet = <any>dummyWallet;
    comp.password = "pass123";

    spyOn(merkleTreeService, "generate").and.returnValue(Promise.reject("error!"));
    spyOn(comp, "onMerkleTreeFailed");

    comp.generateMerkleTree().then(
      () => {
        expect(comp.onMerkleTreeFailed).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "promise reject should not be called");

        done();
      }
    );
  });

  it("should update the progress correctly", () => {
    comp.onProgressUpdate(0.5);
    expect(comp.progress).toBe(50);
    expect(comp.activeStatusMessageIndex).toBe(3);

    comp.onProgressUpdate(0.2);
    expect(comp.progress).toBe(20);
    expect(comp.activeStatusMessageIndex).toBe(1);

    comp.onProgressUpdate(0.8);
    expect(comp.progress).toBe(80);
    expect(comp.activeStatusMessageIndex).toBe(5);

    comp.onProgressUpdate(2.0);
    expect(comp.progress).toBe(100);
    expect(comp.activeStatusMessageIndex).toBe(6);

    comp.onProgressUpdate(-1.0);
    expect(comp.progress).toBe(0);
    expect(comp.activeStatusMessageIndex).toBe(0);
  });

  it("should handle the merkle tree generated event correctly", (done) => {
    let dummyToast = new MockToast();
    let dummyWallet = {};

    comp.wallet = <any>dummyWallet;

    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(toastController, "create").and.returnValue(dummyToast);
    spyOn(comp, "goBackToOriginPage").and.returnValue(Promise.resolve());
    spyOn(dummyToast, "present");

    comp.onMerkleTreeGenerated().then(
      () => {
        expect(walletService.store).toHaveBeenCalledWith(dummyWallet);

        expect(toastController.create).toHaveBeenCalledWith({
          message: comp.successMessage,
          duration: 1500,
          position: "top"
        });

        expect(dummyToast.present).toHaveBeenCalled();

        expect(comp.goBackToOriginPage).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "promist reject should not be called");

        done();
      }
    )
  });

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