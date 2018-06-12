import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RestoreBackupPage } from "./restore-backup";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { IPassphraseService, PassphraseService } from "../../services/passphrase-service/passphrase-service";
import { IPasswordService, PasswordService } from "../../services/password-service/password-service";
import { ICryptoKeyService, CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { MockCryptoKeyService } from "../../../test-config/mocks/MockCryptoKeyService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { MockPassphraseService } from "../../../test-config/mocks/MockPassphraseService";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { INavigationHelperService, NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { IKeyPair } from "../../models/IKeyPair";
import { IKeyStore } from "../../models/IKeyStore";
import { HomePage } from "../home/home";
import { ILocalWallet } from "../../models/ILocalWallet";

describe("RestoreBackupPage", () => {
  let comp: RestoreBackupPage;
  let fixture: ComponentFixture<RestoreBackupPage>;
  let keyStoreService: IKeyStoreService;
  let passphraseService: IPassphraseService;
  let passwordService: IPasswordService;
  let cryptoKeyService: ICryptoKeyService;
  let walletService: IWalletService;
  let navController: NavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;

  beforeEach(async(() => {
    keyStoreService = new MockKeyStoreService();
    passphraseService = new MockPassphraseService();
    passwordService = new MockPasswordService();
    cryptoKeyService = new MockCryptoKeyService();
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();

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
        { provide: PassphraseService, useValue: passphraseService },
        { provide: WalletService, useValue: walletService },
        { provide: CryptoKeyService, useValue: cryptoKeyService },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: NavigationHelperService, useValue: navigationHelperService }
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

    expect(comp.passphraseIsValid).toBeTruthy();
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

  it("should validate the passphrase when the passphrase is changed", () => {
    spyOn(passphraseService, "isValid").and.returnValue(false);

    comp.passphrase = "1 2 3 4 5 6";

    comp.onPassphraseChanged();

    expect(passphraseService.isValid).toHaveBeenCalledWith("1 2 3 4 5 6", 12);
    expect(comp.passphraseIsValid).toBeFalsy();
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

    spyOn(passphraseService, "passphraseStringToWords").and.returnValue([]);

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
      lastUpdateTime: null
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
    comp.passphraseIsValid = false;

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passphrase = "1 2 3 4 5 6";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.password = "pass123";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.walletName = "name";

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passwordStatus = {type: "success"};

    expect(comp.dataIsValid()).toBeFalsy();

    comp.passphraseIsValid = true;

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