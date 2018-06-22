import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RestoreBackupPage } from "./restore-backup";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { IPasswordService, PasswordService } from "../../services/password-service/password-service";
import { ICryptoKeyService, CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { MockCryptoKeyService } from "../../../test-config/mocks/MockCryptoKeyService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { INavigationHelperService, NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { IKeyPair } from "../../models/IKeyPair";
import { IKeyStore } from "../../models/IKeyStore";
import { HomePage } from "../home/home";
import { ILocalWallet } from "../../models/ILocalWallet";
import { IBIP39Service, BIP39Service, IPassphraseValidationResult } from "../../services/bip39-service/bip39-service";
import { MockBIP39Service } from "../../../test-config/mocks/MockBIP39Service";

describe("RestoreBackupPage", () => {
  let comp: RestoreBackupPage;
  let fixture: ComponentFixture<RestoreBackupPage>;
  let keyStoreService: IKeyStoreService;
  let passwordService: IPasswordService;
  let cryptoKeyService: ICryptoKeyService;
  let walletService: IWalletService;
  let navController: MockNavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;
  let bip39Service: IBIP39Service;

  beforeEach(async(() => {
    keyStoreService = new MockKeyStoreService();
    passwordService = new MockPasswordService();
    cryptoKeyService = new MockCryptoKeyService();
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();
    bip39Service = new MockBIP39Service();

    TestBed.configureTestingModule({
      declarations: [RestoreBackupPage],
      imports: [
        IonicModule.forRoot(RestoreBackupPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: PasswordService, useValue: passwordService },
        { provide: WalletService, useValue: walletService },
        { provide: CryptoKeyService, useValue: cryptoKeyService },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: BIP39Service, useValue: bip39Service}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreBackupPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.passphrase).toBe("");
    expect(comp.password).toBe("");
    expect(comp.passwordConfirm).toBe("");
    expect(comp.walletName).toBe("");

    expect(comp.passphraseStatus).not.toBeDefined();
    expect(comp.passwordStatus).not.toBeDefined();
  });

  it("should validate the password when the password is changed", () => {
    spyOn(passwordService, "validate").and.returnValue({type: "success"});

    comp.password = "password";
    comp.passwordConfirm = "passwordConfirm";

    comp.onPasswordChanged();

    expect(passwordService.validate).toHaveBeenCalledWith("password", "passwordConfirm");
    expect(comp.passwordStatus).toEqual({type: "success"});
  });

  it("should validate the passphrase when the passphrase is changed", (done) => {
    let passphraseStatus: IPassphraseValidationResult = {isValid: true};
    spyOn(bip39Service, "check").and.returnValue(Promise.resolve(passphraseStatus));

    comp.passphrase = "1 2 3 4 5 6";

    comp.onPassphraseChanged().then(
      () => {
        expect(bip39Service.check).toHaveBeenCalledWith("1 2 3 4 5 6");
        expect(comp.passphraseStatus).toEqual(passphraseStatus);

        done();
      },
      (error) => {
        expect(true).toBe(false, "Promise rejection should never be called");
        done();
      }
    );
  });

  it("should prepare the wallet correctly", () => {
    let keyPair: IKeyPair = {
      privateKey: "PRIVATE_KEY", 
      publicKey: "PUBLIC_KEY"
    };
    spyOn(cryptoKeyService, "generateKeyPair").and.returnValue(keyPair);

    let keyStore: IKeyStore = {
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
    spyOn(keyStoreService, "createKeyStore").and.returnValue(keyStore);

    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");

    comp.password = "pass123";
    comp.passphrase = "1 2 3 4 5 6 7 8 9 10 11 12";
    comp.walletName = "name";

    let wallet = comp.prepareWallet();

    expect(wallet).toEqual({
      id: "WALLET_ID",
      name: "name",
      type: "local",
      publicKey: "PUBLIC_KEY",
      keyStore: keyStore,
      transactions: [],
      lastUpdateTime: null,
      currencies: [],
      totalCurrentCurrencyValue: 0
    });
  });

  it("should import the wallet correctly", (done) => {
    let dummyWallet: ILocalWallet = <ILocalWallet>{};

    spyOn(walletService, "store").and.returnValue(Promise.resolve());

    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);

    spyOn(comp, "goBackToOriginPage");

    comp.import().then(
      () => {
        expect(walletService.store).toHaveBeenCalledWith(dummyWallet);
        expect(comp.goBackToOriginPage).toHaveBeenCalled();

        done();
      },
      (error) => {
        // Should not be called
        expect(true).toBe(false, "Promise reject should not be called");
        done();
      }
    );
  })

  it("should detect correctly when the input data is valid", () => {
    comp.passphraseStatus = {
      isValid: false,
      isBlocking: true
    };

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passphrase = "1 2 3 4 5 6";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.password = "pass123";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.walletName = "name";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passwordStatus = {type: "success"};

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passphraseStatus.isBlocking = false;

    expect(comp.dataIsValid()).toBeTruthy();

    comp.passphraseStatus.isValid = true;

    expect(comp.dataIsValid()).toBeTruthy();
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
});