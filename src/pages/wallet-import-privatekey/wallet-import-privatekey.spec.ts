import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportPrivatekeyPage } from "./wallet-import-privatekey";
import { IonicModule, NavController, NavParams, ModalController, Modal} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { PasswordExplanationPage } from "../password-explanation/password-explanation";
import { ILocalWallet } from "../../models/ILocalWallet";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { MockModalController } from "../../../test-config/mocks/MockModalController";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { IKeyStore } from "../../models/IKeyStore";
import { IPasswordService, PasswordService } from "../../services/password-service/password-service";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { ComponentsModule } from "../../components/components.module";
import { reject } from "q";

describe("WalletImportPrivatekeyPage", () => {
  let comp: WalletImportPrivatekeyPage;
  let fixture: ComponentFixture<WalletImportPrivatekeyPage>;
  let walletService: IWalletService;
  let modalController: MockModalController;
  let navParams: NavParams;
  let navController: MockNavController;
  let navigationHelperService: NavigationHelperService;
  let keyStoreService: IKeyStoreService;
  let passwordService: IPasswordService;

  beforeEach(async(() => {
    walletService = new MockWalletService();
    navParams = new MockNavParams();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    modalController = new MockModalController();
    keyStoreService = new MockKeyStoreService();
    passwordService = new MockPasswordService();

    TestBed.configureTestingModule({
      declarations: [WalletImportPrivatekeyPage],
      imports: [
        IonicModule.forRoot(WalletImportPrivatekeyPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: ModalController, useValue: modalController },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: PasswordService, useValue: passwordService }
      ]
    }).compileComponents();
  }));

  // Mock NavParams parameters
  beforeEach(() => {
    let realGetFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key) => {
      if(key == NAVIGATION_ORIGIN_KEY) {
        return "home";
      }
      else {
        // Call real function
        realGetFunction.call(navParams);
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportPrivatekeyPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should initialize correctly", () => {
    expect(comp.privateKey).toBe("");
    expect(comp.name).toBe("");
    expect(comp.password).toBe("");
    expect(comp.confirmedPassword).toBe("");
  });

  it("should detect correctly when the passwords fields are pristine", () => {
    comp.password = "";
    comp.confirmedPassword = "";

    expect(comp.passwordsArePristine()).toBeTruthy();

    comp.password = "pass123";

    expect(comp.passwordsArePristine()).toBeTruthy();

    comp.confirmedPassword = "pass123";
    expect(comp.passwordsArePristine()).toBeFalsy();

    comp.password = "";
    expect(comp.passwordsArePristine()).toBeTruthy();
  });

  it("should validate the password when the password is changed", () => {
    spyOn(passwordService, "validate").and.returnValue({type: "success"});

    comp.password = "password";
    comp.confirmedPassword = "passwordConfirm";

    comp.onPasswordsChanged();

    expect(passwordService.validate).toHaveBeenCalledWith("password", "passwordConfirm");
    expect(comp.passwordStatus).toEqual({type: "success"});
  });

  it("should detect correctly when the input data is valid", () => {
    let passwordPristine = true;
    let passwordsValid = false;

    spyOn(comp, "passwordsArePristine").and.callFake(() => passwordPristine);
    comp.privateKey = "";
    comp.name = "";
    comp.passwordStatus = {type: "error"};

    expect(comp.dataIsValid()).toBeFalsy();

    comp.privateKey = "PRIVATE_KEY";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.name = "Name";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passwordStatus.type = "success";

    expect(comp.dataIsValid()).toBeFalsy();

    passwordPristine = false;

    expect(comp.dataIsValid()).toBeTruthy();
  });

  it("should open a modal to explain the password requirement", () => {
    let mockModal: Modal = <any>{
      present: () => {}
    };

    spyOn(modalController, "create").and.callFake(() => {
      return mockModal
    });
    spyOn(mockModal, "present");

    comp.showPasswordExplanation();

    expect(modalController.create).toHaveBeenCalledWith(PasswordExplanationPage);
    expect(mockModal.present).toHaveBeenCalled();
  });

  it("should prepare the wallet correctly", () => {
    let dummyKeyStore: IKeyStore = {
      cipher: "AES-CTR",
      cipherParams: {
        iv: "iv"
      },
      cipherText: "cipherText",
      keyParams: {
        salt: "salt",
        iterations: 32,
        keySize: 32
      },
      controlHash: "controlHash"
    };
    spyOn(keyStoreService, "createKeyStore").and.returnValue(dummyKeyStore);
    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");

    comp.name = "Wallet #1";
    comp.privateKey = "SOME_PRIVATE_KEY";
    comp.password = "pass123";
    
    let wallet = comp.prepareWallet();

    expect(wallet.lastUpdateTime).toBeDefined("wallet lastUpdateTime should be defined");

    // Set wallet update time. Since this is set to the current time
    // there is no real way to unit test its value for correctness.
    wallet.lastUpdateTime = null;

    expect(wallet).toEqual(
      {
        id: "WALLET_ID",
        name: "Wallet #1",
        type: "local",
        publicKey: null,
        keyStore: dummyKeyStore,
        lastUpdateTime: null
      }
    );
  });

  it("should handle the import correctly", (done) => {
    let dummyWallet = {};
    comp.password = "pass123";

    spyOn(comp, "dataIsValid").and.returnValue(true);
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(comp, "goToPrepareWalletPage").and.returnValue(Promise.resolve());

    comp.import().then(
      () => {
        expect(comp.goToPrepareWalletPage).toHaveBeenCalledWith(dummyWallet, "pass123");

        done();
      }
    );
  });

  it("should move to the prepare wallet page correctly", (done) => {
    let dummyWallet = {};
    let params = {
      wallet: dummyWallet,
      password: "pass123"
    };
    params[NAVIGATION_ORIGIN_KEY] = "home";

    spyOn(navController, "push").and.returnValue(Promise.resolve());

    comp.goToPrepareWalletPage(<ILocalWallet><any>dummyWallet, "pass123").then(
      () => {
        expect(navController.push).toHaveBeenCalledWith(PrepareWalletPage, params);

        done();
      },
      (error) => {
        expect(true).toBe(false, "Promise reject should never be called");

        done();
      }
    );
  });

  it("should return a rejected promise because the data is not valid", (done) => {
    spyOn(comp, "dataIsValid").and.returnValue(false);

    comp.import().catch(data => {
      expect(data).toEqual("");
      done();
    });    
  });
});
