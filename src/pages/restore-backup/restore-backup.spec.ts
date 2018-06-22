import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RestoreBackupPage } from "./restore-backup";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { IPasswordService, PasswordService } from "../../services/password-service/password-service";
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
import { IBIP32Service, BIP32Service } from "../../services/bip32-service/bip32-service";
import { MockBIP32Service } from "../../../test-config/mocks/MockBIP32Service";
import { ComponentsModule } from "../../components/components.module";

describe("RestoreBackupPage", () => {
  let comp: RestoreBackupPage;
  let fixture: ComponentFixture<RestoreBackupPage>;
  let keyStoreService: IKeyStoreService;
  let passwordService: IPasswordService;
  let walletService: IWalletService;
  let navController: MockNavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;
  let bip39Service: IBIP39Service;
  let bip32Service: IBIP32Service;

  beforeEach(async(() => {
    keyStoreService = new MockKeyStoreService();
    passwordService = new MockPasswordService();
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    navParams = new MockNavParams();
    bip39Service = new MockBIP39Service();
    bip32Service = new MockBIP32Service();

    TestBed.configureTestingModule({
      declarations: [RestoreBackupPage],
      imports: [
        IonicModule.forRoot(RestoreBackupPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: PasswordService, useValue: passwordService },
        { provide: WalletService, useValue: walletService },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: BIP39Service, useValue: bip39Service},
        { provide: BIP32Service, useValue: bip32Service}
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
    spyOn(bip32Service, "getPrivateKey").and.returnValue("PRIVATE_KEY");
    spyOn(bip39Service, "toSeed").and.returnValue("SEED");

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
      publicKey: null,
      keyStore: keyStore,
      transactions: [],
      lastUpdateTime: null,
      balances: []
    });
  });

  it("should import the wallet correctly", (done) => {
    let dummyWallet: ILocalWallet = <ILocalWallet>{};

    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);

    spyOn(comp, "goToPrepareWalletPage").and.returnValue(Promise.resolve());

    comp.import().then(
      () => {
        expect(comp.goToPrepareWalletPage).toHaveBeenCalled();

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
});