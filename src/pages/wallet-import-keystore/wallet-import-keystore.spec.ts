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
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { IKeyStore } from "../../models/IKeyStore";
import { ILocalWallet } from "../../models/ILocalWallet";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { ComponentsModule } from "../../components/components.module";

describe("WalletImportKeystorePage", () => {
  let comp: WalletImportKeystorePage;
  let fixture: ComponentFixture<WalletImportKeystorePage>;
  let navController: MockNavController;
  let navParams: NavParams;
  let walletService: IWalletService;
  let keyStoreService: IKeyStoreService;
  let navigationHelperService: NavigationHelperService;
  let translateService: TranslateService;
  let toastController: MockToastController;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    walletService = new MockWalletService();
    keyStoreService = new MockKeyStoreService();
    navigationHelperService = new NavigationHelperService();
    translateService = new MockTranslateService();
    toastController = new MockToastController();

    TestBed.configureTestingModule({
      declarations: [WalletImportKeystorePage],
      imports: [
        IonicModule.forRoot(WalletImportKeystorePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: ToastController, useValue: toastController },
        { provide: TranslateService, useValue: translateService }
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
    fixture = TestBed.createComponent(WalletImportKeystorePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.name).toBe("");
    expect(comp.keyStoreString).toBe("");
    expect(comp.password).toBe("");
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
    comp.clipBoardKeyStoreIsInvalid = false;

    expect(comp.clipboardDataIsValid()).toBeTruthy("Data should be valid");

    comp.name = "";
    expect(comp.clipboardDataIsValid()).toBeFalsy("Data should not be valid if name is not set");
    comp.name = "name";

    comp.keyStoreString = "";
    expect(comp.clipboardDataIsValid()).toBeFalsy("Data should not be valid if key store is not set");
    comp.keyStoreString = "keystore-string";

    comp.clipBoardKeyStoreIsInvalid = true;
    expect(comp.clipboardDataIsValid()).toBeFalsy("Data should not be valid if key store is marked as invalid");
  });

  it("should prepare the wallet correctly by clipboard", () => {
    spyOn(keyStoreService, "decryptKeyStore").and.returnValue("SOME_PRIVATE_KEY");
    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");

    comp.name = "name";
    comp.keyStore = <any>{};
    comp.password = "pass123";

    let wallet = comp.prepareWallet("clipboard");

    expect(wallet).toEqual({
      id: "WALLET_ID",
      type: "local",
      name: "name",
      publicKey: null,
      keyStore: comp.keyStore,
      lastUpdateTime: null
    });

    expect(keyStoreService.decryptKeyStore).toHaveBeenCalledWith(comp.keyStore, "pass123");
  });

  it("should perform the import correctly when all data is entered correctly", (done) => {
    let dummyWallet: ILocalWallet = <any>{};
    comp.password = "pass123";
    
    spyOn(comp, "clipboardDataIsValid").and.returnValue(true);
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(comp, "goToPrepareWalletPage").and.returnValue(Promise.resolve());

    comp.importByClipboard().then(
      () => {
        expect(comp.goToPrepareWalletPage).toHaveBeenCalledWith(dummyWallet, "pass123");

        done();
      },
      (error) => {
        // This path should never be reached!
        expect(true).toBeFalsy("Promise reject should not be called");

        done();
      }
    );
  });

  it("should abort the import when the password is not correct", (done) => {
    spyOn(comp, "clipboardDataIsValid").and.returnValue(true);
    spyOn(comp, "prepareWallet").and.returnValue(null);

    comp.importByClipboard().then(
      () => {
        expect(comp.clipboardPasswordIsInvalid).toBeTruthy("Password should be marked as invalid");

        done();
      },
      (error) => {
        // This path should never be reached!
        expect(true).toBeFalsy("Promise reject should not be called");

        done();
      }
    );
  });

  it("should abort the import by clipboard when the data is not valid", (done) => {
    spyOn(comp, "clipboardDataIsValid").and.returnValue(false);

    comp.importByClipboard().then(
      () => {
        expect(true).toBeFalsy("Promise resolve should not be called");
        done();
      },
      (error) => {
        expect(true).toBeTruthy();
        done();
      }
    )
  });

  it("should abort the import by file when the data is not valid", (done) => {
    spyOn(comp, "keystoreFileDataIsValid").and.returnValue(false);

    comp.importByFile().then(
      () => {
        expect(true).toBeFalsy("Promise resolve should not be called");
        done();
      },
      (error) => {
        expect(true).toBeTruthy();
        done();
      }
    )
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

  it("should return false when keystore string is not long enough and not valid and true when long enough and valid", () => {
    comp.keyStoreString = "";
    comp.clipBoardKeyStoreIsInvalid = true;

    expect(comp.canShowClipboardPasswordInput()).toBe(false);

    comp.keyStoreString = "this is not a valid keystore but long enough and we are faking the boolean to be false";
    comp.clipBoardKeyStoreIsInvalid = false;

    expect(comp.canShowClipboardPasswordInput()).toBe(true);
  })

  it("should return false when the password is not long enough and the password can not be shown and true when the password is long enough and the password can be shown", () => {
    spyOn(comp, "canShowClipboardPasswordInput").and.returnValue(true);

    comp.password = "";
    expect(comp.canShowClipboardWalletNameInput()).toBe(false);

    comp.password = "long enough password";
    expect(comp.canShowClipboardWalletNameInput()).toBe(true);
  })

  it("should return true when the name of the imported wallet has zero length and false if the name has atleast one character", () => {
    comp.fileImportedName = "";
    expect(comp.canShowFileChooseImportButton()).toBe(true);

    comp.fileImportedName = "more than one char it is!";
    expect(comp.canShowFileChooseImportButton()).toBe(false);
  })

  it("should return false when the name has zero length and true when the file imported name is atleast one character", () => {
    comp.fileImportedName = "";
    expect(comp.canShowFilePasswordInputAndImportedName()).toBe(false);

    comp.fileImportedName = "more than one char it is!";
    expect(comp.canShowFilePasswordInputAndImportedName()).toBe(true);
  })

  it("should return false when the password has zero length and the file import name can be shown and true when the file import password is atleast one character", () => {
    spyOn(comp, "canShowFilePasswordInputAndImportedName").and.returnValue(true);

    comp.filePassword = "";
    expect(comp.canShowFileImportNameInput()).toBe(false);

    comp.filePassword = "more than one char it is!";
    expect(comp.canShowFileImportNameInput()).toBe(true);
  })

  it("should return false when the file import name cannot be shown and that name has zero characters and true when the file import name is shown and atleast one character", () => {
    spyOn(comp, "canShowFileImportNameInput").and.returnValue(true);

    comp.fileWalletNameImport = "";
    expect(comp.canShowFileImportButton()).toBe(false);

    comp.fileWalletNameImport = "more than one char it is!";
    expect(comp.canShowFileImportButton()).toBe(true);
  })

  it("should call importWalletByCurrentKeystoreInfo if the keystore data is valid", () => {
    spyOn(comp, "keystoreFileDataIsValid").and.returnValue(true);
    spyOn(comp, "importWalletByCurrentKeystoreInfo");

    comp.importByFile();

    expect(comp.importWalletByCurrentKeystoreInfo).toHaveBeenCalled();
  })

  it("should set clipboard password to invalid when preparing the wallet with an invalid password", (done) => {
    spyOn(comp, "prepareWallet").and.returnValue(null);
    comp.importWalletByCurrentKeystoreInfo("clipboard").then(data => {
      expect(comp.clipboardPasswordIsInvalid).toBe(true);
      done();
    });
  })

  it("should set file password to invalid when preparing the wallet with an invalid password", (done) => {
    spyOn(comp, "prepareWallet").and.returnValue(null);
    comp.importWalletByCurrentKeystoreInfo("file").then(data => {
      expect(comp.filePasswordIsInvalid).toBe(true);
      done();
    });
  })

  it("should return undefined when trying to remove with an undefined type", (done) => {
    spyOn(comp, "prepareWallet").and.returnValue(null);
    comp.importWalletByCurrentKeystoreInfo(<any>"NOT_EXISTING").then(data => {
      expect(data).toBeUndefined();
      done();
    });
  })

  it("should prepare the wallet correctly by file", () => {
    spyOn(keyStoreService, "decryptKeyStore").and.returnValue("SOME_PRIVATE_KEY");
    spyOn(walletService, "generateId").and.returnValue("WALLET_ID");

    comp.fileWalletNameImport = "name";
    comp.keyStore = <any>{};
    comp.filePassword = "pass123";

    let wallet = comp.prepareWallet("file");

    expect(wallet).toEqual({
      id: "WALLET_ID",
      type: "local",
      name: "name",
      publicKey: null,
      keyStore: comp.keyStore,
      lastUpdateTime: null
    });

    expect(keyStoreService.decryptKeyStore).toHaveBeenCalledWith(comp.keyStore, "pass123");
  });

  it("should return null after the decryptkeystore returned null as a private key as either file or clipboard", () => {
    spyOn(comp, "prepareWallet").and.callThrough();
    spyOn(keyStoreService, "decryptKeyStore").and.returnValue(null);

    expect(comp.prepareWallet("file")).toBeNull();
  });

  it("should return null after the decryptkeystore returned null as a private key as either file or clipboard", () => {
    spyOn(comp, "prepareWallet").and.callThrough();
    spyOn(keyStoreService, "decryptKeyStore").and.returnValue(null);

    expect(comp.prepareWallet(<any>"NOT_EXISTING")).toBeNull();
  });

  it("should set the variables to default correctly after resetting the keystore file", () => {
    spyOn(comp, "resetCurrentKeystoreFile").and.callThrough();

    comp.resetCurrentKeystoreFile();

    expect(comp.clipboardPasswordIsInvalid).toBe(false);
    expect(comp.filePasswordIsInvalid).toBe(false);
    expect(comp.fileKeystoreIsInvalidNameExtension).toBe(false);
    expect(comp.fileKeystoreInvalidData).toBe(false);
    expect(comp.fileImportedName).toBe("");
    expect(comp.filePassword).toBe("");
    expect(comp.fileWalletNameImport).toBe("");
  })

  it("should return true when the file keystore data is not invalid and the keystore filename extension is not valid and false when the file keystore data is invalid or keystore filename extension invalid", () => {
    comp.fileKeystoreInvalidData = true;
    comp.fileKeystoreIsInvalidNameExtension = true;

    expect(comp.keystoreFileDataIsValid()).toBe(false);

    comp.fileKeystoreInvalidData = false;
    comp.fileKeystoreIsInvalidNameExtension = false;

    expect(comp.keystoreFileDataIsValid()).toBe(true);
  })

  it("should set clipBoardKeyStoreIsInvalid to false when then the keystore length is zero", () => {
    comp.keyStoreString = "";
    comp.onKeyStoreChanged();
    expect(comp.clipBoardKeyStoreIsInvalid).toBe(false);
  })

  it("should set clipBoardKeyStoreIsInvalid to true when the keystore JSON format is valid but the data is not", () => {
    spyOn(comp, "isValidKeyStore").and.returnValue(false);

    comp.keyStoreString = "{}";
    comp.onKeyStoreChanged();
    expect(comp.clipBoardKeyStoreIsInvalid).toBe(true);
    expect(comp.keyStore).toBe(null);
  })

  it("should set clipBoardKeyStoreIsInvalid to false when the keystore JSON format is valid and the data is also", () => {
    spyOn(comp, "isValidKeyStore").and.returnValue(true);

    comp.keyStoreString = "{}";
    comp.onKeyStoreChanged();
    expect(comp.clipBoardKeyStoreIsInvalid).toBe(false);
    expect(comp.keyStore).toEqual(Object({  }));
  })

  it("should catch the JSON parse because the JSON is not valid but length is greater than 0", () => {
    spyOn(comp, "isValidKeyStore").and.returnValue(true);
    spyOn(comp, "onKeyStoreChanged").and.callThrough();

    comp.keyStoreString = "NOT_VALID_JSON";
    comp.onKeyStoreChanged();
    expect(comp.clipBoardKeyStoreIsInvalid).toBe(true);
    expect(comp.keyStore).toBeNull();
  })

  it("should check if process method is called after calling the importedKeystoreFile method", () => {
    spyOn(comp, "importedKeystoreFile").and.callThrough();
    spyOn(comp, "processImportedKeystoreFile");

    comp.importedKeystoreFile({target: {files: [{type: "", name: ""}]}});

    expect(comp.processImportedKeystoreFile).toHaveBeenCalled();
  })

  it("should set an error variable to true if conditions are not met", () => {
    spyOn(comp, "processImportedKeystoreFile").and.callThrough();
    spyOn(comp, "readInputFromBlob");

    comp.processImportedKeystoreFile("", "", null);
    expect(comp.fileKeystoreIsInvalidNameExtension).toBe(true);
    expect(comp.readInputFromBlob).not.toHaveBeenCalled();
    comp.fileKeystoreIsInvalidNameExtension = false;

    comp.processImportedKeystoreFile("UTC--TEXT", ".zip", null);
    expect(comp.fileKeystoreIsInvalidNameExtension).toBe(true);
    expect(comp.readInputFromBlob).not.toHaveBeenCalled();
    comp.fileKeystoreIsInvalidNameExtension = false;

    comp.processImportedKeystoreFile("UTC--TEXT", "", null);
    expect(comp.fileKeystoreIsInvalidNameExtension).toBe(false);
    expect(comp.readInputFromBlob).toHaveBeenCalled();
  })

  it("should call processInputBlob", (done) => {
    spyOn(comp, "readInputFromBlob").and.callThrough();
    spyOn(comp, "processInputBlob");

    let promiseThen = comp.readInputFromBlob(new Blob(), "UTC--TEXT").then(data => {
      expect(comp.processInputBlob).toHaveBeenCalled();
    });

    let promiseCatch = comp.readInputFromBlob(null, null).catch(data => {
      expect(comp.processInputBlob).not.toHaveBeenCalled();
    });
    Promise.all([promiseThen, promiseCatch]).then(data => {
      done();
    });
  })

  it("should set fileKeystoreInvalidData to true because the keystore is not valid and not a valid JSON", () => {
    spyOn(comp, "processInputBlob").and.callThrough();
    spyOn(comp, "isValidKeyStore").and.returnValue(false);

    comp.processInputBlob({target: {files: [{type: "", name: ""}], result: "piece \n of \n text"}}, "filename");

    expect(comp.fileKeystoreInvalidData).toBe(true);
  })

  it("should set fileKeystoreInvalidData to true because the keystore is not valid but a valid JSON", () => {
    spyOn(comp, "processInputBlob").and.callThrough();
    spyOn(comp, "isValidKeyStore").and.returnValue(false);

    comp.processInputBlob({target: {files: [{type: "", name: ""}], result: "{}"}}, "filename");

    expect(comp.fileKeystoreInvalidData).toBe(true);
  })

  it("should set fileKeystoreInvalidData to true because the text is not valid / missing", () => {
    spyOn(comp, "processInputBlob").and.callThrough();

    comp.processInputBlob({target: {files: [{type: "", name: ""}]}}, "filename");

    expect(comp.fileKeystoreInvalidData).toBe(true);
  })

  it("should set fileKeystoreInvalidData to false because the keystore is valid", () => {
    spyOn(comp, "processInputBlob").and.callThrough();
    spyOn(comp, "isValidKeyStore").and.returnValue(true);
    
    let keystore = {"cipher":"AES-CTR","cipherParams":{"iv":"a/ÿûÅ\u0014)\u0018rêYgÅ.¾DÖwW;6×\u000e\u0016aqr"},"cipherText":"JIH","keyParams":{"salt":"G\u0004'G&\u0005ÃµÈ\u0010¶q\u0007vÍ\u0012\u0019O£M3ý`~põqög`\u000b\n\u0003¯4\\¤\u0019BùøÃ{!êjô\\Ý\u001c ½Îê\u0005\u000fN«Î¥^²Ôô`LEK_0\u0016{×ôºæç¯F\u0006Éd\u0012Ò`6ÉS\u0000îK¬D¡ÜnÛ¡\u001dc¸Éz\n\u001fë*P$}Lò?%±à\u0000$Ù¿B\u001fëÒ<@dT3'ê\u000bXï¡\tcÿÑÎÉ~\u00125\u001e¶÷\u001bû\u0007S@\u0002\u0001\u000fù/\u0005¡ö+°¿BC\u0015Íêü\u0016f\nÑÃ&öê\u0019X]\u000e(<ä\u0000=AósµcU£é\u0011ÒÀæÿ\u0018:\u0000¡íÓN+¹\u0013\u0003Py`ÿÈË5\u0018H1ÑRï¼","iterations":128,"keySize":32},"controlHash":"e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7"};

    comp.processInputBlob({target: {files: [{type: "", name: ""}], result: JSON.stringify(keystore)}}, "correctname");

    expect(comp.fileKeystoreInvalidData).toBe(false);
  })
});