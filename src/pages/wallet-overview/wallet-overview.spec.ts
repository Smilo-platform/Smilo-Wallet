import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletOverviewPage } from "./wallet-overview";
import { IonicModule, NavController, NavParams, ToastController, Toast, LoadingController, Loading, AlertController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { Storage } from "@ionic/storage";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { LandingPage } from "../landing/landing";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { MockLoading } from "../../../test-config/mocks/MockLoading";
import { MockLoadingController } from "../../../test-config/mocks/MockLoadingController";
import { MockAlertController } from "../../../test-config/mocks/MockAlertController";
import { MockAlert } from "../../../test-config/mocks/MockAlert";
import { ICurrency } from "../../models/ICurrency";

describe("WalletOverviewPage", () => {
  let comp: WalletOverviewPage;
  let fixture: ComponentFixture<WalletOverviewPage>;
  let navController: NavController;
  let toastController: ToastController;
  let walletService: IWalletService;
  let loadingController: LoadingController;
  let alertController: AlertController;

  beforeEach(async(() => {
    navController = new MockNavController();
    toastController = new MockToastController();
    walletService = new MockWalletService();
    loadingController = new MockLoadingController();
    alertController = new MockAlertController();

    TestBed.configureTestingModule({
      declarations: [WalletOverviewPage],
      imports: [
        IonicModule.forRoot(WalletOverviewPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() },
        { provide: ToastController, useValue: toastController },
        { provide: LoadingController, useValue: loadingController },
        { provide: AlertController, useValue: alertController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletOverviewPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should initialize correctly", () => {
    expect(comp.pickedCurrency).toBeUndefined("pickedCurrency should be undefined");
    expect(comp.doughnutChart).toBeUndefined("dougnutChart should be undefined");
    expect(comp.wallets.length).toBe(0, "wallets length should be 0");
    expect(comp.currenciesForDoughnutCanvas.length).toBe(0, "currenciesForDougnutCanvas length should be 0");
    expect(comp.currenciesForDoughnutCanvasCurrencies.length).toBe(0, "currenciesForDoughnutCanvasCurrencies length should be 0");
    expect(comp.currentWallet).toBeUndefined("currentWallet should be undefined");
    expect(comp.currentWalletIndex).toBe(0, "currentWalletIndex should be 0");
    expect(comp.legendList.length).toBe(0, "legendList length should be 0");
    expect(comp.availableExchanges.length).toBe(0, "availableCurrencies length should be 0");
    expect(comp.showFundsStatus).toBe(true, "showFundsStatus should be true");
    expect(comp.twoFactorStatus).toBe(false, "twoFactorStatus should be false");
    expect(comp.walletFundsVisibility).toBe("shown", "walletFundsVisiblity should be shown");
  })

  it("should have visibility hidden after switching visibility", () => {
    comp.fundsSwitch();

    expect(comp.walletFundsVisibility).toBe("hidden");
  })

  it("should present an alert when deleting a wallet", (done) => {
    comp.initialize().then(data => {
      let alert = new MockAlert();

      spyOn(alertController, "create").and.returnValue(alert)
      spyOn(alert, "present");

      comp.deleteWallet();

      expect(alert.present).toHaveBeenCalled();

      done();
    });
  })

  it("should return false after deleting a wallet that doesn't exist", () => {
    let result = comp.deleteSelectedWallet(null);

    expect(result).toBe(false);
  })

  it("should return undefined because there is no current wallet", () => {
    expect(comp.currentWallet).toBeUndefined();
  })

  it("should return undefined data after getting the wallet currencies because the wallet does not exist", (done) => {
    comp.getWalletBalance("I DON'T EXIST").then(data => {
      expect(data).toBeUndefined();

      done();
    });
  })

  it("should return undefined data after calculating the picked currency values because there is no picked currency", (done) => {
    comp.setCalculatedCurrencyValue().then(data => {
      expect(data).toBeUndefined();

      done();
    });
  })

  it("should open landing page correctly", () => {
    spyOn(navController, "push");

    comp.openLandingPage();

    expect(navController.push).toHaveBeenCalledWith(LandingPage);
  });

  it("should return false after displaying the chart because the chart currencies and amounts are not defined", () => {
    let result = comp.displayChart();

    expect(result).toBe(false);
  })

  it("should call getAllWallets and getAvailableCurrencies", () => {
    spyOn(comp, "getAllWallets");
    spyOn(comp, "getAvailableExchanges");

    comp.initialize();

    expect(comp.getAllWallets).toHaveBeenCalled();
    expect(comp.getAvailableExchanges).toHaveBeenCalled();
  })

  it("should have three correct datas after getting the wallets", (done) => {
    spyOn(comp, "getWalletBalance");
    comp.getAllWallets().then(() => {
      expect(comp.wallets).toEqual(<any>[
        {id: "012d294e-cb11-439b-937a-12d47a52c305",
            type: "local",
            name: "Biosta",
            publicKey: "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ",
            encryptedPrivateKey: "E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
        {id: "9b5329ff-c683-42a5-9165-4093e4076166",
            type: "local",
            name: "Labilo",
            publicKey: "ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN",
            encryptedPrivateKey: "E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
        {id: "a2e16167-fedb-47d2-8856-2b3f97389c35",
            type: "local",
            name: "Zalista",
            publicKey: "EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY",
            encryptedPrivateKey: "E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"}
        ]);

      done();
    });
  })

  it("should have five specific currency arrays after getting the available currencies data with mocked data", (done) => {
    comp.getAvailableExchanges().then(data => {
      expect(comp.availableExchanges[0].availableCurrencies).toEqual(["$", "ETH", "BTC"]);
      expect(comp.availableExchanges[1].availableCurrencies).toEqual(["$", "BTC"]);
      expect(comp.availableExchanges[2].availableCurrencies).toEqual(["$"]);
      expect(comp.availableExchanges[3].availableCurrencies).toEqual(["$"]);
      expect(comp.availableExchanges[4].availableCurrencies).toEqual(["$", "ETH", "BTC"]);

      done();
    })
  })

  it("should get two specific currency types and amounts back after getting it with mock data", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletBalance("I EXIST").then(data => {
        expect(comp.currentWallet.currencies[0].currency).toBe("Smilo");
        expect(comp.currentWallet.currencies[0].amount).toBe(5712);
        expect(comp.currentWallet.currencies[1].currency).toBe("SmiloPay");
        expect(comp.currentWallet.currencies[1].amount).toBe(234);

        done();
      });
    });
  })

  it("should contain correct data for graph", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletBalance("I EXIST").then(data => {
        comp.pickedCurrency = "$";
        comp.setCalculatedCurrencyValue().then(data => {
          expect(comp.currenciesForDoughnutCanvas.length).toBe(2);
          expect(comp.currenciesForDoughnutCanvas[0]).toBe(96.06);
          expect(comp.currenciesForDoughnutCanvas[1]).toBe(3.94);
          expect(comp.currenciesForDoughnutCanvasCurrencies.length).toBe(2);
          expect(comp.currenciesForDoughnutCanvasCurrencies[0]).toBe("Smilo");
          expect(comp.currenciesForDoughnutCanvasCurrencies[1]).toBe("SmiloPay");

          done();
        });
      });
    });
  });
});