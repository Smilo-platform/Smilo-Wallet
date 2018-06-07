import { async, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { WalletNewDisclaimerPage } from "./wallet-new-disclaimer";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";

describe("WalletNewDisclaimerPage", () => {
  let comp: WalletNewDisclaimerPage;
  let fixture: ComponentFixture<WalletNewDisclaimerPage>;
  let navController: NavController;
  let navParams: NavParams;
  let walletService: IWalletService;
  let cryptoKeyService: CryptoKeyService;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    walletService = new MockWalletService();
    cryptoKeyService = new CryptoKeyService();

    TestBed.configureTestingModule({
      declarations: [WalletNewDisclaimerPage],
      imports: [
        IonicModule.forRoot(WalletNewDisclaimerPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: CryptoKeyService, useValue: cryptoKeyService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams }
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
      else {
        // Call real function
        realGetFunction.call(navParams);
      }
    });
  });

  beforeEach(() => {
    spyOn(cryptoKeyService, "generateKeyPair").and.returnValue(
      {
        privateKey: "PRIVATE_KEY",
        publicKey: "PUBLIC_KEY"
      }
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewDisclaimerPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.agreedToTerm1).toBe(false);
    expect(comp.agreedToTerm2).toBe(false);
    expect(comp.agreedToTerm3).toBe(false);
    expect(comp.agreedToTerm4).toBe(false);
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

  it("should detect correctly when the user has agreed to all terms", () => {
    comp.agreedToTerm1 = false;
    comp.agreedToTerm2 = false;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    expect(comp.userHasAgreed()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = false;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    expect(comp.userHasAgreed()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = false;
    comp.agreedToTerm4 = false;
    expect(comp.userHasAgreed()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = true;
    comp.agreedToTerm4 = false;
    expect(comp.userHasAgreed()).toBe(false);

    comp.agreedToTerm1 = true;
    comp.agreedToTerm2 = true;
    comp.agreedToTerm3 = true;
    comp.agreedToTerm4 = true;
    expect(comp.userHasAgreed()).toBe(true);
  });

  it("should prepare the wallet correctly", () => {
    let wallet = comp.prepareWallet();

    expect(wallet).toEqual(
      {
        id: "SOME_ID",
        type: "local",
        name: "Some Wallet",
        publicKey: "PUBLIC_KEY",
        encryptedPrivateKey: "PRIVATE_KEY"
      }
    );

    expect(cryptoKeyService.generateKeyPair).toHaveBeenCalledWith(
      [
        "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve"
      ],
      "pass123"
    );
  });

  it("should prepare and store the wallet correctly on finish", () => {
    let dummyWallet = {};

    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(comp, "userHasAgreed").and.returnValue(true);

    comp.finish();

    expect(comp.prepareWallet).toHaveBeenCalled();
    expect(walletService.store).toHaveBeenCalledWith(dummyWallet);
  });

  it("should set navigation root to WalletOverviewPage on succesfull finish", (done) => {
    let dummyWallet = {};

    spyOn(walletService, "store").and.returnValue(Promise.resolve());
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(comp, "userHasAgreed").and.returnValue(true);
    spyOn(navController, "setRoot");

    comp.finish().then(
      () => {
        expect(navController.setRoot).toHaveBeenCalledWith(WalletOverviewPage);

        done();
      }
    );
  });

  it("should not go to the wallet overview page if storing the wallet failed", (done) => {
    let dummyWallet = {};

    spyOn(walletService, "store").and.returnValue(Promise.reject("ERROR_MESSAGE"));
    spyOn(comp, "prepareWallet").and.returnValue(dummyWallet);
    spyOn(comp, "userHasAgreed").and.returnValue(true);
    spyOn(navController, "setRoot");

    comp.finish().then(
      () => {
        expect(navController.setRoot).not.toHaveBeenCalled();

        done();
      }
    );
  });
});
