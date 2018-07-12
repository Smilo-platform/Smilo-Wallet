import { async, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { WalletNewDisclaimerPage } from "./wallet-new-disclaimer";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { KeyStoreService, IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { IKeyStore } from "../../models/IKeyStore";
import { PrepareWalletPage } from "../prepare-wallet/prepare-wallet";
import { NAVIGATION_ORIGIN_KEY } from "../wallet/wallet";
import { ILocalWallet } from "../../models/ILocalWallet";
import { IBIP32Service, BIP32Service } from "../../services/bip32-service/bip32-service";
import { IBIP39Service, BIP39Service } from "../../services/bip39-service/bip39-service";
import { MockBIP32Service } from "../../../test-config/mocks/MockBIP32Service";
import { MockBIP39Service } from "../../../test-config/mocks/MockBIP39Service";
import { ComponentsModule } from "../../components/components.module";

describe("WalletNewDisclaimerPage", () => {
  let comp: WalletNewDisclaimerPage;
  let fixture: ComponentFixture<WalletNewDisclaimerPage>;
  let navController: MockNavController;
  let navParams: NavParams;
  let walletService: IWalletService;
  let keyStoreService: IKeyStoreService;
  let bip32Service: IBIP32Service;
  let bip39Service: IBIP39Service;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    walletService = new MockWalletService();
    keyStoreService = new MockKeyStoreService();
    bip32Service = new MockBIP32Service();
    bip39Service = new MockBIP39Service();

    TestBed.configureTestingModule({
      declarations: [WalletNewDisclaimerPage],
      imports: [
        IonicModule.forRoot(WalletNewDisclaimerPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: BIP32Service, useValue: bip32Service },
        { provide: BIP39Service, useValue: bip39Service }
      ]
    }).compileComponents();
  }));

  // Mock NavParams parameters
  beforeEach(() => {
    let realGetFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key) => {
      if(key == "passphrase") {
        // Return mocked passphrase
        return [
          "one", "two", "three", "four", "five", "six",
          "seven", "eight", "nine", "ten", "eleven", "twelve"
        ];
      }
      else if(key == "password") {
        // Return mocked password
        return "pass123";
      }
      else if(key == NAVIGATION_ORIGIN_KEY) {
        return "home";
      }
      else {
        // Call real function
        realGetFunction.call(navParams);
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewDisclaimerPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.agreedToTerm1).toBe(false, "Term 1 should not be accepted initially");
    expect(comp.agreedToTerm2).toBe(false, "Term 2 should not be accepted initially");
    expect(comp.agreedToTerm3).toBe(false, "Term 3 should not be accepted initially");
    expect(comp.agreedToTerm4).toBe(false, "Term 4 should not be accepted initially");
    expect(comp.walletName).toBe("", "Wallet name should be empty initally");
  });

  it("should read the passphrase and password correctly from the nav params", () => {
    expect(comp.passphrase).toEqual(
      [
        "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve"
      ]
    );

    expect(comp.password).toEqual("pass123");
  });

  it("should detect correctly when the user has entered all information correctly", () => {
    comp.agreedToTerm1 = false;
    comp.agreedToTerm2 = false;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    comp.walletName = "";
    expect(comp.canShowFinishButton()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = false;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    comp.walletName = "";
    expect(comp.canShowFinishButton()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    comp.walletName = "";
    expect(comp.canShowFinishButton()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = true;
    comp.agreedToTerm4 = false;
    comp.walletName = "";
    expect(comp.canShowFinishButton()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = true;
    comp.agreedToTerm4 = true;
    comp.walletName = "";
    expect(comp.canShowFinishButton()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = true;
    comp.agreedToTerm4 = true;
    comp.walletName = "name";
    expect(comp.canShowFinishButton()).toBe(true);
  });

  it("should prepare the wallet correctly", () => {
    spyOn(bip39Service, "toSeed").and.returnValue("SEED");
    spyOn(bip32Service, "getPrivateKey").and.returnValue("PRIVATE_KEY");

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

    comp.walletName = "name";

    let wallet = comp.prepareWallet();

    expect(wallet.lastUpdateTime).toBeDefined("wallet lastUpdateTime should be defined");

    // Set wallet update time. Since this is set to the current time
    // there is no real way to unit test its value for correctness.
    wallet.lastUpdateTime = null;

    expect(wallet).toEqual(
      {
        id: "SOME_ID",
        type: "local",
        name: "name",
        publicKey: null,
        keyStore: dummyKeyStore,
        lastUpdateTime: null
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

  it("should handle finish correctly when all data is correct", (done) => {
    let dummyWallet = {};
    comp.password = "pass123";

    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(comp, "canShowFinishButton").and.returnValue(true);
    spyOn(comp, "goToPrepareWalletPage").and.returnValue(Promise.resolve());

    comp.finish().then(
      () => {
        expect(comp.goToPrepareWalletPage).toHaveBeenCalledWith(dummyWallet, "pass123");

        done();
      }
    );
  });

  it("should return an empty promise if the finish button cannot be shown ", (done) => {
    spyOn(comp, "canShowFinishButton").and.returnValue(false);

    comp.finish().then(data => {
      expect(data).toBeUndefined();
      done();
    });
  });
});
