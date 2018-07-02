import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletOverviewPage } from "./wallet-overview";
import { IonicModule, NavController, NavParams, ToastController, Toast, Alert, LoadingController, Loading, AlertController} from "ionic-angular/index";
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
import { IBalance } from "../../models/IBalance";
import { ComponentsModule } from "../../components/components.module";
import { Clipboard } from "@ionic-native/clipboard";
import { File as FileNative} from "@ionic-native/file";
import { MockClipboard } from "../../../test-config/mocks/MockClipboard";
import { MockFileNative } from "../../../test-config/mocks/MockFileNative";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { KeyStoreService, IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { IExchangesService, ExchangesService } from "../../services/exchanges-service/exchanges-service";
import { IWalletTransactionHistoryService, WalletTransactionHistoryService } from "../../services/wallet-transaction-history-service/wallet-transaction-history-service";
import { IWalletBalanceService, WalletBalanceService } from "../../services/wallet-balance-service/wallet-balance-service";
import { MockExchangesService } from "../../../test-config/mocks/MockExchangesSevice";
import { MockWalletTransactionHistoryService } from "../../../test-config/mocks/MockWalletTransactionHistoryService";
import { MockWalletBalanceService } from "../../../test-config/mocks/MockWalletBalanceService";
import { TransferPage } from "../transfer/transfer";
import { IWallet } from "../../models/IWallet";
import { MockToast } from "../../../test-config/mocks/MockToast";

describe("WalletOverviewPage", () => {
  let comp: WalletOverviewPage;
  let fixture: ComponentFixture<WalletOverviewPage>;
  let navController: NavController;
  let toastController: ToastController;
  let walletService: IWalletService;
  let loadingController: LoadingController;
  let alertController: AlertController;
  let clipBoard: Clipboard;
  let fileNative: FileNative;
  let bulkTranslateService: BulkTranslateService;
  let keystoreService: IKeyStoreService;
  let exchangeService: IExchangesService;
  let transactionHistoryService: IWalletTransactionHistoryService;
  let walletBalancesService: IWalletBalanceService;
  let toast: MockToast;
  let alert: MockAlert;

  beforeEach(async(() => {
    navController = new MockNavController();
    toastController = new MockToastController();
    walletService = new MockWalletService();
    loadingController = new MockLoadingController();
    alertController = new MockAlertController();
    clipBoard = new MockClipboard();
    fileNative = new MockFileNative();
    bulkTranslateService = new MockBulkTranslateService();
    keystoreService = new MockKeyStoreService();
    exchangeService = new MockExchangesService();
    transactionHistoryService = new MockWalletTransactionHistoryService();
    walletBalancesService = new MockWalletBalanceService();
    toast = new MockToast();
    alert = new MockAlert();

    TestBed.configureTestingModule({
      declarations: [WalletOverviewPage],
      imports: [
        IonicModule.forRoot(WalletOverviewPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() },
        { provide: ToastController, useValue: toastController },
        { provide: LoadingController, useValue: loadingController },
        { provide: AlertController, useValue: alertController },
        { provide: Clipboard, useValue: clipBoard },
        { provide: FileNative, useValue: fileNative },
        { provide: BulkTranslateService, useValue: bulkTranslateService },
        { provide: KeyStoreService, useValue: keystoreService },
        { provide: ExchangesService, useValue: exchangeService },
        { provide: WalletTransactionHistoryService, useValue: transactionHistoryService },
        { provide: WalletBalanceService, useValue: walletBalancesService },
        { provide: Toast, useValue: toast },
        { provide: Alert, useValue: alert }
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
    expect(comp.currenciesForDoughnutCanvasLabels.length).toBe(0, "currenciesForDoughnutCanvasCurrencies length should be 0");
    expect(comp.currentWallet).toBeUndefined("currentWallet should be undefined");
    expect(comp.currentWalletIndex).toBe(0, "currentWalletIndex should be 0");
    expect(comp.legendList.length).toBe(0, "legendList length should be 0");
    expect(comp.availableExchanges.length).toBe(0, "availableCurrencies length should be 0");
    expect(comp.showFundsStatus).toBe(true, "showFundsStatus should be true");
    expect(comp.walletFundsVisibility).toBe("shown", "walletFundsVisiblity should be shown");
    expect(comp.currentWallet).toBeUndefined();
    expect(comp.loading).toBeUndefined();
    expect(comp.loadingError).toBeUndefined();
    expect(comp.totalCurrentCurrencyValue).toBeUndefined();
    expect(comp.balances).toBeUndefined();
  })

  it("should have visibility hidden after switching visibility", () => {
    comp.fundsSwitch();

    expect(comp.walletFundsVisibility).toBe("hidden");
    expect(comp.walletFundsVisibilityTransferButton).toBe("shown");
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

  it("should open landing page and show a toast after deleting the only wallet", (done) => {
    // Get all 3 wallets
    comp.getAllWallets().then(data => {
      // Delete first one
      comp.deleteSelectedWallet(comp.currentWallet);
      // Delete second one
      comp.deleteSelectedWallet(comp.currentWallet);

      spyOn(comp, "openLandingPage");
      spyOn(comp, "showToastMessage");

      // Delete last one
      comp.deleteSelectedWallet(comp.currentWallet);

      expect(comp.openLandingPage).toHaveBeenCalled();
      expect(comp.showToastMessage).toHaveBeenCalled();
      
      done();
    });
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

  // it("should return false after displaying the chart because the chart currencies and amounts are not defined", () => {
  //   let result = comp.displayChart();

  //   expect(result).toBe(false);
  // })

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
      expect(comp.availableExchanges[0].availableCurrencies).toEqual(["USD", "ETH", "BTC", "XSM"]);
      expect(comp.availableExchanges[1].availableCurrencies).toEqual(["USD", "BTC", "XSM"]);
      expect(comp.availableExchanges[2].availableCurrencies).toEqual(["USD", "XSM"]);
      expect(comp.availableExchanges[3].availableCurrencies).toEqual(["USD", "XSM"]);
      expect(comp.availableExchanges[4].availableCurrencies).toEqual(["USD", "ETH", "BTC", "XSM"]);

      done();
    })
  })

  it("should get two specific currency types and amounts back after getting it with mock data", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletBalance("I EXIST").then(data => {
        expect(comp.balances[0].currency).toBe("XSM");
        expect(comp.balances[0].amount).toBe(5712);
        expect(comp.balances[1].currency).toBe("XSP");
        expect(comp.balances[1].amount).toBe(234);

        done();
      });
    });
  })

  it("should contain correct data for graph", (done) => {
    comp.getAllWallets().then(data => {
      comp.getWalletBalance("I EXIST").then(data => {
        comp.pickedCurrency = "USD";
        comp.setCalculatedCurrencyValue().then(data => {
          expect(comp.currenciesForDoughnutCanvas.length).toBe(2);
          expect(comp.currenciesForDoughnutCanvas[0]).toBe(96.06);
          expect(comp.currenciesForDoughnutCanvas[1]).toBe(3.94);
          expect(comp.currenciesForDoughnutCanvasLabels.length).toBe(2);
          expect(comp.currenciesForDoughnutCanvasLabels[0]).toBe("XSM");
          expect(comp.currenciesForDoughnutCanvasLabels[1]).toBe("XSP");

          done();
        });
      });
    });
  });

  it("should have five transaction histories for the wallet", (done) => {
    comp.getAllWallets().then(data => {
      comp.getTransactionHistory("ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ").then(data => {
        expect(comp.transactionsHistory.length).toBe(5);
        expect(comp.transactionsHistory).toEqual([
          { "date": "Jun 14, 2018 18:01:44 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "17srYd7sVwKgE5ha7ZXSBxUACjm2hMVQeH", "amount": "55", "currency": "XSM"},
          { "date": "Jun 13, 2018 19:14:34 PM", "input": "1KkPiyNvRHsWC67KgK6AFHMWoxmcGm5d1H", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "292", "currency": "XSP"},
          { "date": "Jun 08, 2018 15:44:36 PM", "input": "1LtqTERxw4QFLCbfLgB43P1XGAWUNmk6DA", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "122", "currency": "XSM"},
          { "date": "May 28, 2018 17:22:53 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "1AvAvNh6PjzN9jjhUNhT5DuzMPgnhM6R2u", "amount": "254", "currency": "XSM"},
          { "date": "May 26, 2018 23:44:51 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "13QMZULQGBodKzsAF462Dh2opf8PQawYBt", "amount": "5192", "currency": "XSP"},
        ]);
        done();
      });
    });
  })

  it("should call initialize when the view is loaded", () => {
    spyOn(comp, "initialize");

    comp.ionViewDidLoad();

    expect(comp.initialize).toHaveBeenCalled();
  });

  it("should have the funds visiblity to shown after they were invisible", () => {
    comp.walletFundsVisibility = "hidden";

    comp.fundsSwitch();

    expect(comp.walletFundsVisibility).toBe("shown");
    expect(comp.walletFundsVisibilityTransferButton).toBe("hidden");
  });

  it("should open the transfer page correctly", () => {
    spyOn(navController, "push");

    comp.openTransferPage();

    expect(navController.push).toHaveBeenCalledWith(TransferPage);
  })

  it("should call balance and history after refreshing the wallet", () => {
    spyOn(comp, "getWalletBalance");
    spyOn(comp, "getTransactionHistory");

    comp.currentWallet = <IWallet>{};
    comp.currentWallet.publicKey = "";

    comp.refreshWalletBalance();

    expect(comp.getWalletBalance).toHaveBeenCalled();
    expect(comp.getTransactionHistory).toHaveBeenCalled();
  })

  it("should not open landing page and show a toast after deleting a wallet while some wallets still exist", (done) => {
    // Get all 3 wallets
    comp.getAllWallets().then(data => {
      // Delete first one
      comp.deleteSelectedWallet(comp.currentWallet);

      spyOn(comp, "openLandingPage");
      spyOn(comp, "showToastMessage");

      // Delete last one
      comp.deleteSelectedWallet(comp.currentWallet);

      expect(comp.openLandingPage).not.toHaveBeenCalled();
      expect(comp.showToastMessage).not.toHaveBeenCalled();
      
      done();
    });
  })

  it("should return 7 fixed numbers if the picked currency is not in the if condition", () => {
    comp.pickedCurrency = "I DON'T EXIST";

    let result = comp.getFixedNumbers();

    expect(result).toEqual(7);
  })

  it("should call createElement, appendChild, execCommand and removechild upon copying to clipboard for web", () => {
    spyOn(document, "createElement");
    spyOn(document.body, "appendChild");
    spyOn(document, "execCommand");
    spyOn(document.body, "removeChild");

    comp.copyToClipboardWeb("data");

    expect(document.createElement).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  })

  it("should call createElement, appendChild, removeChild upon downloading a txt file for web", () => {
    spyOn(document, "createElement");
    spyOn(document.body, "appendChild");
    spyOn(document.body, "removeChild");

    comp.downloadTxtFileWeb("data", "filename");

    expect(document.createElement).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it("should call create and present upon showing a toast message", () => {
    spyOn(toastController, "create").and.returnValue(toast);
    spyOn(toast, "present");
    
    comp.showToastMessage("message", 1000, "bottom");

    expect(toastController.create).toHaveBeenCalled();
    expect(toast.present).toHaveBeenCalled();
  });

  it("should call a create and present error modal after getting the available exchanges list with a rejected promise", (done) => {
    spyOn(exchangeService, "getAvailableExchanges").and.returnValue(Promise.reject(""));
    spyOn(comp, "getAvailableExchanges").and.callThrough();
    spyOn(alertController, "create").and.returnValue(alert);
    spyOn(alert, "present");

    comp.initialize().then(data => {
      expect(alertController.create).toHaveBeenCalled();
      expect(alert.present).toHaveBeenCalled();
      done();
    });
  });

  it("should call a create and present error modal after getting the wallets with a rejected promise", (done) => {
    spyOn(walletService, "getAll").and.returnValue(Promise.reject(""));
    spyOn(comp, "getAllWallets").and.callThrough();
    spyOn(alertController, "create").and.returnValue(alert);
    spyOn(alert, "present");

    comp.initialize().then(data => {
      expect(alertController.create).toHaveBeenCalled();
      expect(alert.present).toHaveBeenCalled();
      done();
    });
  })
});