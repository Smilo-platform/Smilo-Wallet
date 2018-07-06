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
import { ILocalWallet } from "../../models/ILocalWallet";

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
        { provide: WalletBalanceService, useValue: walletBalancesService }
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
    comp.walletFundsVisibility = "shown";
    comp.walletFundsVisibilityTransferButton = "hidden";

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

  it("should open landing page and show a toast after deleting the last wallet", (done) => {
    comp.wallets = [
      <ILocalWallet>{
        "id": "4b6cff11-5888-43bb-bde1-911e12b659e6",
        "type": "local",
        "name": "Bosha",
        "publicKey": "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
        "keyStore": {
          "cipher": "AES-CTR",
          "cipherParams": {
            "iv": "a/ÿûÅ\u0014)\u0018rêYgÅ.¾DÖwW;6×\u000e\u0016aqr"
          },
          "cipherText": "JIH",
          "keyParams": {
            "salt": "G\u0004'G&\u0005ÃµÈ\u0010¶q\u0007vÍ\u0012\u0019O£M3ý`~põqög`\u000b\n\u0003¯4\\¤\u0019BùøÃ{!êjô\\Ý\u001c ½Îê\u0005\u000fN«Î¥^²Ôô`LEK_0\u0016{×ôºæç¯F\u0006Éd\u0012Ò`6ÉS\u0000îK¬D¡ÜnÛ¡\u001dc¸Éz\n\u001fë*P$}Lò?%±à\u0000$Ù¿B\u001fëÒ<@dT3'ê\u000bXï¡\tcÿÑÎÉ~\u00125\u001e¶÷\u001bû\u0007S@\u0002\u0001\u000fù/\u0005¡ö+°¿BC\u0015Íêü\u0016f\nÑÃ&öê\u0019X]\u000e(<ä\u0000=AósµcU£é\u0011ÒÀæÿ\u0018:\u0000¡íÓN+¹\u0013\u0003Py`ÿÈË5\u0018H1ÑRï¼",
            "iterations": 128,
            "keySize": 32
          },
          "controlHash": "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7"
        },
        "lastUpdateTime": null
      },
      <ILocalWallet>{
        "id": "a6ecc41b-45ef-4834-8801-7865e9262d9f",
        "type": "local",
        "name": "Pilosha",
        "publicKey": "S56RDBKX5237GDQQWIASNQFKOJHLMTXGL6OAQT",
        "keyStore": {
          "cipher": "AES-CTR",
          "cipherParams": {
            "iv": "¥YVù#µ°P´b­.L\r±ú]íP¼ ß~æb¸¡Zû\u0000"
          },
          "cipherText": "Gnïzá\u000fð\u0004C\bÑ}u=;É¤Ý\u001aM!Ør´<\u000bö\u0017lÕ\u0004*ýg\u0018r\r\"1uðP\u001c#",
          "keyParams": {
            "salt": "B\u0002åk÷ÜyDûJN\u001e©§\u0003\u0005g\u000fÂÁ\u0013à\"gð\u000bÚ\u0005\u0000«Ä8¾§»6´D¾ùâ\u001eÎÁ¿ç\\\u0016yáÉá«ÌësÊ/\u0010Ã74¥ë%y\u0001\".ÌK4__¥9CSwêuðø]©Zê\u0004»\u0015üÅ¹¸´CJW ¶1öMéyLc.ó\u0018¸¬x\nzNq$3I\u0014vÿÏø\u0000:@ïçëe\u0019\u0017ðu\f&¸\tVfÞ8á)µ9Jh\\\u0003WªU\u0010!, ßËzD\u001d\b ` K:Î\u000f°Ò8dp9½­øz§Ç¬\u0011¼NYMPÑ ´¸)hAöÄg:ìiSHÔµ*G(\u0011(5º}¿Ð£V\u001cöfA",
            "iterations": 128,
            "keySize": 32
          },
          "controlHash": "da5c5529888a42d2d810b2023aa169dc8bec12682641ac58da05d5da5e059acb"
        },
        "lastUpdateTime": null
      },
      <ILocalWallet>{
        "id": "a16585b7-0f85-4e02-9331-e2bff92e6677",
        "type": "local",
        "name": "Bosha",
        "publicKey": "S5UDTFETMPSS4KOZTO2CK6SALLYX2OJJ77FEQR",
        "keyStore": {
          "cipher": "AES-CTR",
          "cipherParams": {
            "iv": "a/ÿûÅ\u0014)\u0018rêYgÅ.¾DÖwW;6×\u000e\u0016aqr"
          },
          "cipherText": "JIH",
          "keyParams": {
            "salt": "G\u0004'G&\u0005ÃµÈ\u0010¶q\u0007vÍ\u0012\u0019O£M3ý`~põqög`\u000b\n\u0003¯4\\¤\u0019BùøÃ{!êjô\\Ý\u001c ½Îê\u0005\u000fN«Î¥^²Ôô`LEK_0\u0016{×ôºæç¯F\u0006Éd\u0012Ò`6ÉS\u0000îK¬D¡ÜnÛ¡\u001dc¸Éz\n\u001fë*P$}Lò?%±à\u0000$Ù¿B\u001fëÒ<@dT3'ê\u000bXï¡\tcÿÑÎÉ~\u00125\u001e¶÷\u001bû\u0007S@\u0002\u0001\u000fù/\u0005¡ö+°¿BC\u0015Íêü\u0016f\nÑÃ&öê\u0019X]\u000e(<ä\u0000=AósµcU£é\u0011ÒÀæÿ\u0018:\u0000¡íÓN+¹\u0013\u0003Py`ÿÈË5\u0018H1ÑRï¼",
            "iterations": 128,
            "keySize": 32
          },
          "controlHash": "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7"
        },
        "lastUpdateTime": null
      }
    ];
    spyOn(comp, "openLandingPage");
    spyOn(comp, "showToastMessage");

    comp.currentWallet = comp.wallets[0];
    // Delete first one
    comp.deleteSelectedWallet(comp.currentWallet);
    expect(comp.openLandingPage).not.toHaveBeenCalled();
    expect(comp.showToastMessage).not.toHaveBeenCalled();
    // Delete second one
    comp.deleteSelectedWallet(comp.currentWallet);
    expect(comp.openLandingPage).not.toHaveBeenCalled();
    expect(comp.showToastMessage).not.toHaveBeenCalled();
    // Delete last one
    comp.deleteSelectedWallet(comp.currentWallet);

    expect(comp.openLandingPage).toHaveBeenCalled();
    expect(comp.showToastMessage).toHaveBeenCalled();
    
    done();
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
        {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Hosha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"},
        {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Bosha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"},
        {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Losha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"}]);
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

  it("should return two fixed numbers if the pickedcurrency is EUR or USD, otherwhise 7", () => {
    comp.pickedCurrency = "I DON'T EXIST";
    let result = comp.getFixedNumbers();
    expect(result).toEqual(7);

    comp.pickedCurrency = "EUR";
    result = comp.getFixedNumbers();
    expect(result).toEqual(2);

    comp.pickedCurrency = "USD";
    result = comp.getFixedNumbers();
    expect(result).toEqual(2);
  })

  it("should call createElement, appendChild, execCommand and removechild upon copying to clipboard for web", () => {
    let input: HTMLInputElement = document.createElement("input");
    spyOn(document, "createElement").and.returnValue(input);
    spyOn(input, "setAttribute");
    spyOn(input, "select");
    spyOn(document.body, "appendChild");
    spyOn(document, "execCommand");
    spyOn(document.body, "removeChild");

    comp.copyToClipboardWeb("data");

    expect(document.createElement).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(input);
    expect(input.setAttribute).toHaveBeenCalledWith("value", "data");
    expect(input.select).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(document.body.removeChild).toHaveBeenCalledWith(input);
  })

  it("should call createElement, appendChild, removeChild upon downloading a txt file for web", () => {
    let anchor: HTMLAnchorElement = document.createElement("a");
    spyOn(document, "createElement").and.returnValue(anchor);
    spyOn(anchor, "setAttribute");
    spyOn(anchor, "style");
    spyOn(anchor, "click");
    spyOn(document.body, "appendChild");
    spyOn(document.body, "removeChild");

    comp.downloadTxtFileWeb("data", "filename");

    expect(document.createElement).toHaveBeenCalled();
    expect(anchor.setAttribute).toHaveBeenCalledWith("href", "data:text/plain;charset=utf-8,data");
    expect(anchor.setAttribute).toHaveBeenCalledWith("download", "filename");
    expect(anchor.style.display).toBe("none");
    expect(document.body.appendChild).toHaveBeenCalledWith(anchor);
    expect(anchor.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(anchor);
  });

  it("should call create and present upon showing a toast message", () => {
    let toast: MockToast = new MockToast();
    spyOn(toastController, "create").and.returnValue(toast);
    spyOn(toast, "present");
    
    comp.showToastMessage("message", 1000, "bottom");

    expect(toastController.create).toHaveBeenCalled();
    expect(toast.present).toHaveBeenCalled();
  });

  it("should call a create and present error modal after getting the available exchanges list with a rejected promise", (done) => {
    let alert: MockAlert = new MockAlert();
    spyOn(exchangeService, "getAvailableExchanges").and.returnValue(Promise.reject(""));
    spyOn(comp, "getAvailableExchanges").and.callThrough();
    spyOn(alertController, "create").and.returnValue(alert);
    spyOn(alert, "present");

    comp.getAvailableExchanges().then(data => {
      expect(alertController.create).toHaveBeenCalled();
      expect(alert.present).toHaveBeenCalled();
      done();
    });
  });

  it("should call a create and present error modal after getting the wallets with a rejected promise", (done) => {
    let alert: MockAlert = new MockAlert();
    spyOn(walletService, "getAll").and.returnValue(Promise.reject(""));
    spyOn(comp, "getAllWallets").and.callThrough();
    spyOn(alertController, "create").and.returnValue(alert);
    spyOn(alert, "present");

    comp.getAllWallets().then(data => {
      expect(alertController.create).toHaveBeenCalled();
      expect(alert.present).toHaveBeenCalled();
      done();
    });
  })
});