import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PrepareWalletPage } from "./prepare-wallet";
import { IonicModule, NavController, NavParams, ToastController, ModalController} from "ionic-angular/index";
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
import { MockMerkleTree } from "../../../test-config/mocks/MockMerkleTree";
import { MockModalController } from "../../../test-config/mocks/MockModalController";
import { MockModal } from "../../../test-config/mocks/MockModal";
import { WalletErrorPage } from "../wallet-error/wallet-error";
import { Platform } from "ionic-angular/platform/platform";
import { WalletExtraImportPage } from "../wallet-extra-import/wallet-extra-import";
import { MockSettingsService } from "../../../test-config/mocks/MockSettingsService";
import { SettingsService } from "../../services/settings-service/settings-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

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
  let modalController: MockModalController;
  let platformService: Platform;
  let settingService: MockSettingsService;
  let bip39: Smilo.BIP39;
  let bip32: Smilo.BIP32;

  beforeEach(async(() => {
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();
    merkleTreeService = new MockMerkleTreeService();
    toastController = new MockToastController();
    translateService = new MockTranslateService();
    modalController = new MockModalController();
    settingService = new MockSettingsService();

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
        { provide: TranslateService, useValue: translateService },
        { provide: ModalController, useValue: modalController },
        { provide: SettingsService, useValue: settingService }
      ]
    }).compileComponents();

    // We do not mock or inject the service manually here.
    // For some reason this did not work...
    platformService = TestBed.get(Platform);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareWalletPage);
    comp = fixture.componentInstance;
  });

  beforeEach(() => {
    bip39 = (<any>comp).bip39;
    bip32 = (<any>comp).bip32;
  })

  it("should create component", () => expect(comp).toBeDefined());

  it("should register for back button event on page load", () => {
    spyOn(comp, "initialize");

    // Dummy unregister back button function
    function dummyFunction() {};

    spyOn(platformService, "registerBackButtonAction").and.returnValue(dummyFunction);

    comp.ionViewDidLoad();

    expect(platformService.registerBackButtonAction).toHaveBeenCalledWith(comp.onBackButtonClicked, 101);
    expect(comp.unregisterBackButtonAction).toBe(dummyFunction);
  });

  it("should unregister for back button on page unload", () => {
    function dummyFunction() {};

    comp.unregisterBackButtonAction = dummyFunction;

    spyOn(comp, "unregisterBackButtonAction");

    comp.ionViewDidLeave();

    expect(comp.unregisterBackButtonAction).toHaveBeenCalled();
  });

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
    spyOn(comp, "onMerkleTreeGenerated");

    comp.generateMerkleTree();

    expect(merkleTreeService.generate).toHaveBeenCalledWith(dummyWallet, "pass123", comp.onProgressUpdate);
  });

  it("should reset progress when starting to generate a merkle tree", () => {
    spyOn(merkleTreeService, "generate").and.returnValue(Promise.resolve());
    spyOn(comp, "onMerkleTreeGenerated");
    spyOn(comp, "onMerkleTreeFailed");

    comp.progress = 80;
    comp.activeStatusMessageIndex = 5;

    comp.generateMerkleTree();

    expect(comp.progress).toBe(0);
    expect(comp.activeStatusMessageIndex).toBe(0);
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
    let dummyWallet: any = {};
    let merkleTree = new MockMerkleTree();

    comp.wallet = dummyWallet;
    comp.password = "pass123";

    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(toastController, "create").and.returnValue(dummyToast);
    spyOn(comp, "finalize").and.returnValue(Promise.resolve());
    spyOn(merkleTree, "getPublicKey").and.returnValue("PUBLIC_KEY");
    spyOn(merkleTreeService, "get").and.returnValue(Promise.resolve(merkleTree));
    
    spyOn(dummyToast, "present");

    comp.onMerkleTreeGenerated().then(
      () => {
        expect(merkleTreeService.get).toHaveBeenCalledWith(dummyWallet, "pass123");

        expect(dummyWallet.publicKey).toBe("PUBLIC_KEY");

        expect(walletService.store).toHaveBeenCalledWith(dummyWallet);

        expect(toastController.create).toHaveBeenCalledWith({
          message: comp.successMessage,
          duration: 1500,
          position: "top"
        });

        expect(dummyToast.present).toHaveBeenCalled();

        expect(comp.finalize).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "promist reject should not be called");

        done();
      }
    );
  });

  it("should handle finalize correctly when no passphrase was defined", (done) => {
    comp.passphrase = null;
    comp.walletIndex = null;

    spyOn(modalController, "create");
    spyOn(comp, "goBackToOriginPage");

    comp.finalize().then(
      () => {
        expect(modalController.create).not.toHaveBeenCalled();
        expect(comp.goBackToOriginPage).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "Promise reject should never be called");

        done();
      }
    )
  });

  it("should handle finalize correctly when a passphrase was defined and the user does not want to import another wallet", (done) => {
    comp.passphrase = "PASSPHRASE";
    comp.walletIndex = 10;
    comp.selectedTheme = "light-theme";

    let mockModal = new MockModal();
    let dummyWallet: Smilo.ILocalWallet = <any>{};

    spyOn(modalController, "create").and.returnValue(mockModal);
    spyOn(comp, "goBackToOriginPage");
    spyOn(comp, "generateMerkleTree");
    spyOn(mockModal, "present");
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(mockModal, "onDidDismiss").and.callFake((callback) => {
      // We listen for any listeners attaching to the onDidDismiss event.
      // Once attached we immediately call the callback function.
      callback({
        importExtra: false
      })
    });
    
    comp.finalize().then(
      () => {
        // Expect a modal to have been created and displayed to the user
        expect(modalController.create).toHaveBeenCalledWith(WalletExtraImportPage, {
          nextIndex: 11
        }, {
          enableBackdropDismiss: false,
          cssClass: "light-theme"
        });
        expect(mockModal.present).toHaveBeenCalled();

        // make sure the goBackToOriginPage was called
        expect(comp.goBackToOriginPage).toHaveBeenCalled();

        // Make sure no extra Merkle Tree is being generated
        expect(comp.generateMerkleTree).not.toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "Promise reject should never be called");
        done();
      }
    );
  });

  it("should handle finalize correctly when a passphrase was defined and the user wants to import another wallet", (done) => {
    comp.passphrase = "PASSPHRASE";
    comp.walletIndex = 10;
    comp.selectedTheme = "light-theme";

    let mockModal = new MockModal();
    let dummyWallet: Smilo.ILocalWallet = <any>{};

    spyOn(modalController, "create").and.returnValue(mockModal);
    spyOn(comp, "goBackToOriginPage");
    spyOn(comp, "generateMerkleTree");
    spyOn(mockModal, "present");
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(mockModal, "onDidDismiss").and.callFake((callback) => {
      // We listen for any listeners attaching to the onDidDismiss event.
      // Once attached we immediately call the callback function.
      callback({
        importExtra: true,
        name: "WALLET_NAME",
        index: 100
      })
    });
    
    comp.finalize().then(
      () => {
        // Expect a modal to have been created and displayed to the user
        expect(modalController.create).toHaveBeenCalledWith(WalletExtraImportPage, {
          nextIndex: 11
        }, {
          enableBackdropDismiss: false,
          cssClass: "light-theme"
        });
        expect(mockModal.present).toHaveBeenCalled();

        // make sure the goBackToOriginPage was not called
        expect(comp.goBackToOriginPage).not.toHaveBeenCalled();

        // Expect wallet and walletIndex to be updated correctly
        expect(comp.wallet).toBe(dummyWallet);
        expect(comp.walletIndex).toBe(100);

        // Expect another Merkle Tree is being generated
        expect(comp.generateMerkleTree).toHaveBeenCalled();

        done();
      },
      (error) => {
        expect(true).toBe(false, "Promise reject should never be called");
        done();
      }
    );
  });

  it("should prepare an extra wallet correctly", () => {
    comp.passphrase = "PASSPHRASE";

    spyOn(bip39, "toSeed").and.returnValue("SEED");
    spyOn(bip32, "getPrivateKey").and.returnValue("PRIVATE_KEY");
    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");

    let dummyKeystore: Smilo.IKeyStore = <any>{};
    spyOn((<any>comp).encryptionHelper, "createKeyStore").and.returnValue(dummyKeystore);

    let wallet = comp.prepareWallet("WALLET_NAME", 10);

    expect(wallet).toEqual({
      id: "WALLET_ID",
      name: "WALLET_NAME",
      type: "local",
      publicKey: null,
      keyStore: dummyKeystore,
      lastUpdateTime: null
    });
  });

  it("should handle the merkle tree failed event correctly", () => {
    let modal: MockModal = new MockModal();

    spyOn(modalController, "create").and.returnValue(modal);

    spyOn(modal, "present");

    comp.onMerkleTreeFailed("Some Error");

    expect(modalController.create).toHaveBeenCalledWith(WalletErrorPage, {error: "Some Error"}, {enableBackdropDismiss: false});
    expect(modal.present).toHaveBeenCalled();
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