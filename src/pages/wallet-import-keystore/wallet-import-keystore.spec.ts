import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportKeystorePage } from "./wallet-import-keystore";
import { IonicModule, NavController, NavParams, ToastController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { MockCryptoKeyService } from "../../../test-config/mocks/MockCryptoKeyService";
import { ICryptoKeyService, CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { IKeyStore } from "../../models/IKeyStore";
import { HomePage } from "../home/home";
import { ILocalWallet } from "../../models/ILocalWallet";
import { MockToast } from "../../../test-config/mocks/MockToast";

describe("WalletImportKeystorePage", () => {
  let comp: WalletImportKeystorePage;
  let fixture: ComponentFixture<WalletImportKeystorePage>;
  let navController: NavController;
  let navParams: NavParams;
  let walletService: IWalletService;
  let keyStoreService: IKeyStoreService;
  let cryptoKeyService: ICryptoKeyService;
  let navigationHelperService: NavigationHelperService;
  let translateService: TranslateService;
  let toastController: ToastController;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    walletService = new MockWalletService();
    keyStoreService = new MockKeyStoreService();
    cryptoKeyService = new MockCryptoKeyService();
    navigationHelperService = new NavigationHelperService();
    translateService = new MockTranslateService();
    toastController = new MockToastController();

    TestBed.configureTestingModule({
      declarations: [WalletImportKeystorePage],
      imports: [
        IonicModule.forRoot(WalletImportKeystorePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: CryptoKeyService, useValue: cryptoKeyService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: ToastController, useValue: toastController },
        { provide: TranslateService, useValue: translateService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportKeystorePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.name).toBe("");
    expect(comp.keyStoreString).toBe("");
    expect(comp.password).toBe("");
    expect(comp.successMessage).toBe("import_keystore.toast.success");
  });

  it("should detect when a property is a number correctly", () => {
    expect(comp.isNumber(2)).toBeTruthy();
    expect(comp.isNumber(101010101)).toBeTruthy();
    expect(comp.isNumber("hi")).toBeFalsy();
    expect(comp.isNumber(false)).toBeFalsy();
    expect(comp.isNumber({})).toBeFalsy();
    expect(comp.isNumber([])).toBeFalsy();
  });

  it("should detect a defined and filled string correctly", () => {
    expect(comp.isDefinedAndFilledString("Hello")).toBeTruthy();
    expect(comp.isDefinedAndFilledString("1")).toBeTruthy();
    expect(comp.isDefinedAndFilledString("")).toBeFalsy();
    expect(comp.isDefinedAndFilledString(null)).toBeFalsy();
    expect(comp.isDefinedAndFilledString(undefined)).toBeFalsy();
    expect(comp.isDefinedAndFilledString(0)).toBeFalsy();
    expect(comp.isDefinedAndFilledString(false)).toBeFalsy();
    expect(comp.isDefinedAndFilledString([])).toBeFalsy();
    expect(comp.isDefinedAndFilledString({})).toBeFalsy();
  });

  it("should validate a key store correctly", () => {
    let keyStore: IKeyStore = {
      cipher: "AES-CTR",
      cipherParams: {
        iv: "iv"
      },
      cipherText: "cipherText",
      keyParams: {
        salt: "salt",
        iterations: 128,
        keySize: 32
      },
      controlHash: "controlHash"
    };

    expect(comp.isValidKeyStore(keyStore)).toBeTruthy();

    // Now screw up the key store
    keyStore.cipher = <any>"WRONG_ALGO";
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Algorithm should be validated correctly");
    keyStore.cipher = "AES-CTR";

    keyStore.cipherParams = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Cipher params should be validated correctly");
    keyStore.cipherParams = {iv: null};

    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Ciper params initial vector should be validated correctly");
    keyStore.cipherParams.iv = "iv";

    keyStore.cipherText = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Cipher text should be validated correctly");
    keyStore.cipherText = "cipherText";

    keyStore.keyParams = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Key params should be validated correctly");
    keyStore.keyParams = {
      salt: null,
      iterations: 128,
      keySize: 32
    };

    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Key params salt should be validated correctly");
    keyStore.keyParams.salt = "salt";

    keyStore.keyParams.iterations = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Key params iterations should be validated correctly");
    keyStore.keyParams.iterations = 128;

    keyStore.keyParams.keySize = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Key params key size should be validated correctly");
    keyStore.keyParams.keySize = 32;

    keyStore.controlHash = null;
    expect(comp.isValidKeyStore(keyStore)).toBeFalsy("Control hash should be validated correctly");
  });

  it("should detect correctly when all data is valid", () => {
    comp.name = "name";
    comp.keyStoreString = "keystore-string";
    comp.keyStoreIsInvalid = false;

    expect(comp.dataIsValid()).toBeTruthy("Data should be valid");

    comp.name = "";
    expect(comp.dataIsValid()).toBeFalsy("Data should not be valid if name is not set");
    comp.name = "name";

    comp.keyStoreString = "";
    expect(comp.dataIsValid()).toBeFalsy("Data should not be valid if key store is not set");
    comp.keyStoreString = "keystore-string";

    comp.keyStoreIsInvalid = true;
    expect(comp.dataIsValid()).toBeFalsy("Data should not be valid if key store is marked as invalid");
  });

  it("should prepare the wallet correctly", () => {
    spyOn(keyStoreService, "decryptKeyStore").and.returnValue("SOME_PRIVATE_KEY");
    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");
    spyOn(cryptoKeyService, "generatePublicKey").and.returnValue("SOME_PUBLIC_KEY");

    comp.name = "name";
    comp.keyStore = <any>{};
    comp.password = "pass123";

    let wallet = comp.prepareWallet();

    expect(wallet).toEqual({
      id: "WALLET_ID",
      type: "local",
      name: "name",
      publicKey: "SOME_PUBLIC_KEY",
      keyStore: comp.keyStore,
      transactions: [],
      lastUpdateTime: null,
      balances: [],
      encryptedPrivateKey: ""
    });

    expect(keyStoreService.decryptKeyStore).toHaveBeenCalledWith(comp.keyStore, "pass123");
    expect(cryptoKeyService.generatePublicKey).toHaveBeenCalledWith("SOME_PRIVATE_KEY");
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

    expect(navigationHelperService.navigateBack).toHaveBeenCalledWith(navController, 3);
  });

  it("should navigate back correctly when the origin page is 'wallet_overview'", () => {
    // Mock navParams.get
    spyOn(navParams, "get").and.callFake((key) => "wallet_overview");

    spyOn(navigationHelperService, "navigateBack");
    
    comp.goBackToOriginPage();

    expect(navigationHelperService.navigateBack).toHaveBeenCalledWith(navController, 3);
  });

  it("should perform the import correctly when all data is entered correctly", (done) => {
    let dummyWallet: ILocalWallet = <any>{};
    let mockToast = new MockToast();
    
    spyOn(comp, "dataIsValid").and.returnValue(true);
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(toastController, "create").and.returnValue(mockToast);
    spyOn(mockToast, "present");
    spyOn(comp, "goBackToOriginPage");

    comp.import().then(
      () => {
        expect(walletService.store).toHaveBeenCalledWith(dummyWallet);
        expect(toastController.create).toHaveBeenCalled();
        expect(mockToast.present).toHaveBeenCalled();
        expect(comp.goBackToOriginPage).toHaveBeenCalled();

        done();
      }
    );
  });

  it("should abort the import when the password is not correct", (done) => {
    spyOn(comp, "dataIsValid").and.returnValue(true);
    spyOn(comp, "prepareWallet").and.returnValue(null);

    comp.import().then(
      () => {
        expect(comp.passwordIsInvalid).toBeTruthy("Password should be marked as invalid");

        

        done();
      },
      (error) => {
        // This path should never be reached!
        expect(true).toBeFalsy("Promise resolve should not be called");

        done();
      }
    );
  });

  it("should abort the import when the data is not valid", (done) => {
    spyOn(comp, "dataIsValid").and.returnValue(false);

    comp.import().then(
      () => {
        expect(true).toBeTruthy();
        done();
      },
      (error) => {
        expect(true).toBeFalsy("Promise resolve should not be called");
        done();
      }
    )
  });
});