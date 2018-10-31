import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportPassphrasePage } from "./wallet-import-passphrase";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IPasswordService, PasswordService, IPasswordValidationResult } from "../../services/password-service/password-service";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IWalletService, WalletService } from "../../services/wallet-service/wallet-service";
import { INavigationHelperService, NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { ComponentsModule } from "../../components/components.module";
import { FormBuilder } from "@angular/forms";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

describe("WalletImportPassphrasePage", () => {
  let comp: WalletImportPassphrasePage;
  let fixture: ComponentFixture<WalletImportPassphrasePage>;
  let passwordService: IPasswordService;
  let walletService: IWalletService;
  let navController: MockNavController;
  let navParams: NavParams;
  let navigationHelperService: INavigationHelperService;
  let bulkTranslateService: BulkTranslateService;
  let bip39: Smilo.BIP39;
  let bip32: Smilo.BIP32;

  beforeEach(async(() => {
    passwordService = new MockPasswordService();
    walletService = new MockWalletService();
    navController = new MockNavController();
    navigationHelperService = new NavigationHelperService();
    bulkTranslateService = new MockBulkTranslateService();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [WalletImportPassphrasePage],
      imports: [
        IonicModule.forRoot(WalletImportPassphrasePage),
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
        { provide: BulkTranslateService, useValue: bulkTranslateService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: FormBuilder, useClass: FormBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportPassphrasePage);
    comp = fixture.componentInstance;
  });

  beforeEach(() => {
    bip39 = (<any>comp).bip39;
    bip32 = (<any>comp).bip32;
  })

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.passphrase).toBe("");
    expect(comp.password).toBe("");
    expect(comp.passwordConfirm).toBe("");
    expect(comp.walletName).toBe("");
    expect(comp.walletIndex).toBe(0);
    expect(comp.form).toBeDefined();

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

  it("should validate the passphrase when the passphrase is changed", () => {
    let passphraseStatus: Smilo.IPassphraseValidationResult = {isValid: true};
    spyOn(bip39, "check").and.returnValue(passphraseStatus);

    comp.passphrase = "1 2 3 4 5 6";

    comp.onPassphraseChanged();

    expect(bip39.check).toHaveBeenCalledWith("1 2 3 4 5 6");
    expect(comp.passphraseStatus).toEqual(passphraseStatus);
  });

  it("should prepare the wallet correctly", () => {
    spyOn(bip32, "getPrivateKey").and.returnValue("PRIVATE_KEY");
    spyOn(bip39, "toSeed").and.returnValue("SEED");

    let keyStore: Smilo.IKeyStore = {
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
    spyOn((<any>comp).encryptionHelper, "createKeyStore").and.returnValue(keyStore);

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
      lastUpdateTime: null
    });
  });

  it("should import the wallet correctly", (done) => {
    let dummyWallet: Smilo.ILocalWallet = <Smilo.ILocalWallet>{};

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

  it("should detect correctly when the passphrase is invalid", () => {
    let passphraseStatus: Smilo.IPassphraseValidationResult = {
      isValid: false,
      isBlocking: false,
      errorMessage: "invalid_size"
    };

    spyOn(bip39, "check").and.returnValue(passphraseStatus);

    comp.passphraseStatus = null;
    comp.passphrase = "passphrase";

    comp.onPassphraseChanged();

    expect(bip39.check).toHaveBeenCalledWith("passphrase");

    expect(comp.passphraseStatus).toEqual({
      isValid: false,
      isBlocking: false,
      errorMessage: "invalid_size"
    });
  });

  it("should detect correctly when the password is invalid", () => {
    let passwordStatus: IPasswordValidationResult = {
      type: "error",
      message: "SOME ERROR"
    };

    spyOn(passwordService, "validate").and.returnValue(passwordStatus);

    comp.passwordStatus = null;
    comp.password = "pass123";
    comp.passwordConfirm = "pass456";

    comp.onPasswordChanged();

    expect(passwordService.validate).toHaveBeenCalledWith("pass123", "pass456");
  });

  it("should detect correctly when the name is invalid", () => {
    let passwordControl = comp.form.controls["password"];
    let passwordConfirmControl = comp.form.controls["passwordConfirm"];

    passwordControl.setValue("");
    expect(passwordControl.valid).toBeFalsy();

    passwordControl.setValue("pass123");
    expect(passwordControl.valid).toBeTruthy();

    passwordConfirmControl.setValue("");
    expect(passwordConfirmControl.valid).toBeFalsy();

    passwordConfirmControl.setValue("pass123");
    expect(passwordConfirmControl.valid).toBeTruthy();
  });

  it("should detect correctly when the wallet index is invalid", () => {
    let control = comp.form.controls["walletIndex"];

    control.setValue("-1");
    expect(control.valid).toBeFalsy();

    control.setValue("1.1");
    expect(control.valid).toBeFalsy();

    control.setValue("1.1.1.1");
    expect(control.valid).toBeFalsy();

    control.setValue("2");
    expect(control.valid).toBeTruthy();
  });

  it("should detect correctly when the input data is valid", () => {
    comp.passphraseStatus = {
      isValid: false,
      isBlocking: true
    };

    // Set address index to an invalid value
    comp.form.controls["walletIndex"].setValue(-1);

    expect(comp.dataIsValid()).toBeFalsy("1");

    comp.form.controls["passphrase"].setValue("1 2 3 4 5 6");

    expect(comp.dataIsValid()).toBeFalsy("2");

    comp.form.controls["password"].setValue("pass123");

    expect(comp.dataIsValid()).toBeFalsy("3");

    comp.form.controls["passwordConfirm"].setValue("pass123");

    expect(comp.dataIsValid()).toBeFalsy("3");

    comp.form.controls["walletName"].setValue("name");

    expect(comp.dataIsValid()).toBeFalsy("4");

    comp.passwordStatus = {type: "success"};

    expect(comp.dataIsValid()).toBeFalsy("5");

    comp.form.controls["walletIndex"].setValue(1);

    expect(comp.dataIsValid()).toBeFalsy("6");

    comp.passphraseStatus.isBlocking = false;

    expect(comp.dataIsValid()).toBeTruthy("7");

    comp.passphraseStatus.isValid = true;

    expect(comp.dataIsValid()).toBeTruthy("8");
  });

  it("should push the preparewalletpage on the navcontroller with the right parameters", () => {
    spyOn(navParams, "get").and.returnValue("something");
    spyOn(navController, "push");

    comp.passphrase = "passphrase";
    comp.walletIndex = 0;

    comp.goToPrepareWalletPage(null, "pass");

    expect(navController.push).toHaveBeenCalledWith(PrepareWalletPage, {wallet: null, password: 'pass', passphrase: 'passphrase', walletIndex: 0, NAVIGATION_ORIGIN: 'something'});
  });
});