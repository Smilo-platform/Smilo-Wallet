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

  it("should have picked currency as undefined", () => {
    expect(comp.pickedCurrency).toBeUndefined();
  })

  it("should have dougnutchart as undefined", () => {
    expect(comp.doughnutChart).toBeUndefined();
  })

  it("should have no wallets", () => {
    expect(comp.wallets.length).toEqual(0);
  })

  it("should have an empty amounts for the dougnut chart", () => {
    expect(comp.currenciesForDoughnutCanvas.length).toEqual(0);
  })

  it("should have empty currencies for the dougnut chart", () => {
    expect(comp.currenciesForDoughnutCanvasCurrencies.length).toEqual(0);
  })

  it("should have current wallet as undefined ", () => {
    expect(comp.currentWallet).toBeUndefined();
  })

  it("should have current wallet index as 0", () => {
    expect(comp.currentWalletIndex).toEqual(0);
  })

  it("should have an empty legend list", () => {
    expect(comp.legendList.length).toEqual(0);
  })

  it("should have no available currencies", () => {
    expect(comp.availableCurrencies.length).toEqual(0);
  })

  it("should have show fund status to be truthy", () => {
    expect(comp.showFundsStatus).toBeTruthy();
  })

  it("should have two factor authentication to be falsy", () => {
    expect(comp.twoFactorStatus).toBeFalsy();
  })

  it("should have funds visibility standard to 'shown'", () => {
    expect(comp.walletFundsVisibility).toEqual("shown");
  })

  it("should have visibility hidden after switching visibility", () => {
    comp.fundsSwitch();

    expect(comp.walletFundsVisibility).toEqual("hidden");
  })

  it("should present an alert when deleting a wallet", (done) => {
    comp.initialize().then(data => {
      let alert = new MockAlert();

      spyOn(alertController, "create").and.returnValue(alert)
  
      spyOn(alert, "present");
  
      comp.deleteWalletClick();
  
      expect(alert.present).toHaveBeenCalled();
      done();
    });
  })

  it("should return false after deleting a wallet that doesn't exist", () => {
    let result = comp.deleteSelectedWallet(null);

    expect(result).toBeFalsy();
  })

  it("should return undefined because there is no current wallet", () => {
    expect(comp.currentWallet).toBeUndefined();
  })

  it("should return undefined data after getting the wallet currencies because the wallet does not exist", (done) => {
    comp.getWalletCurrency("I DON'T EXIST").then(data => {
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

  it("should return false after setting the current wallet index because it does not exist", () => {
    let result = comp.setCurrentWallet(0);

    expect(result).toBeFalsy();

    let result2 = comp.setCurrentWallet(100);

    expect(result2).toBeFalsy();
  })

  it("should return false after displaying the chart because the chart currencies and amounts are not defined", () => {
    let result = comp.displayChart();

    expect(result).toBeFalsy();

  })

  it("should have three wallets after getting the wallets again with mocked data", (done) => {
    comp.initialize().then(data => {
      expect(comp.wallets.length).toEqual(3);
      done();
    });
  })

  it("should have three correct datas after getting the wallets", (done) => {
    comp.initialize().then(() => {
      expect(comp.wallets[0].publicKey).toEqual("ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ");
      expect(comp.wallets[0].id).toEqual("012d294e-cb11-439b-937a-12d47a52c305");
      expect(comp.wallets[0].name).toEqual("Biosta");
      expect(comp.wallets[0].type).toEqual("local");
      expect(comp.wallets[0].encryptedPrivateKey).toEqual("E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262");

      expect(comp.wallets[1].publicKey).toEqual("ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN");
      expect(comp.wallets[1].id).toEqual("9b5329ff-c683-42a5-9165-4093e4076166");
      expect(comp.wallets[1].name).toEqual("Labilo");
      expect(comp.wallets[1].type).toEqual("local");
      expect(comp.wallets[1].encryptedPrivateKey).toEqual("E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262");

      expect(comp.wallets[2].publicKey).toEqual("EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY");
      expect(comp.wallets[2].id).toEqual("a2e16167-fedb-47d2-8856-2b3f97389c35");
      expect(comp.wallets[2].name).toEqual("Zalista");
      expect(comp.wallets[2].type).toEqual("local");
      expect(comp.wallets[1].encryptedPrivateKey).toEqual("E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262");
      done();
    });
  })

  it("should have three available currencies after getting the currencies data with mocked data", (done) => {
    comp.initialize().then(() => {
      expect(comp.availableCurrencies.length).toEqual(3);
      done();
    });
  });

  it("should have three specific currencies after getting the available currencies data with mocked data", (done) => {
    comp.getAvailableCurrencies().then(data => {
      expect(comp.availableCurrencies[0]).toEqual("$");
      expect(comp.availableCurrencies[1]).toEqual("ETH");
      expect(comp.availableCurrencies[2]).toEqual("BTC");
      done();
    })
  })

  it("should get two wallet currencies back after getting it with mock data", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletCurrency("I EXIST").then(data => {
        expect(comp.currentWallet.currencies.length).toEqual(2);
        done();
      });
    });
  })

  it("should get two specific currency types and amounts back after getting it with mock data", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletCurrency("I EXIST").then(data => {
        expect(comp.currentWallet.currencies[0].currency).toEqual("Smilo");
        expect(comp.currentWallet.currencies[0].amount).toEqual(5712);
        expect(comp.currentWallet.currencies[1].currency).toEqual("SmiloPay");
        expect(comp.currentWallet.currencies[1].amount).toEqual(234);
        done();
      });
    });
  })

  it("should contain correct data for graph", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletCurrency("I EXIST").then(data => {
        comp.pickedCurrency = "$";
        comp.setCalculatedCurrencyValue().then(data => {
          expect(comp.currenciesForDoughnutCanvas.length).toEqual(2);
          expect(comp.currenciesForDoughnutCanvas[0]).toEqual(96.06);
          expect(comp.currenciesForDoughnutCanvas[1]).toEqual(3.94);
          expect(comp.currenciesForDoughnutCanvasCurrencies.length).toEqual(2);
          expect(comp.currenciesForDoughnutCanvasCurrencies[0]).toEqual("Smilo");
          expect(comp.currenciesForDoughnutCanvasCurrencies[1]).toEqual("SmiloPay");
          done();
        });
      });
    });
  });
});