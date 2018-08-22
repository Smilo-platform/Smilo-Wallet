import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletOverviewPage } from "./wallet-overview";
import { IonicModule, NavController, NavParams, ToastController, LoadingController, AlertController, Platform } from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { LandingPage } from "../landing/landing";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { MockLoadingController } from "../../../test-config/mocks/MockLoadingController";
import { MockAlertController } from "../../../test-config/mocks/MockAlertController";
import { MockAlert } from "../../../test-config/mocks/MockAlert";
import { ComponentsModule } from "../../components/components.module";
import { Clipboard } from "@ionic-native/clipboard";
import { File as FileNative } from "@ionic-native/file";
import { MockClipboard } from "../../../test-config/mocks/MockClipboard";
import { MockFileNative } from "../../../test-config/mocks/MockFileNative";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { KeyStoreService, IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { IExchangesService, ExchangesService } from "../../services/exchanges-service/exchanges-service";
import { IWalletTransactionHistoryService, WalletTransactionHistoryService } from "../../services/wallet-transaction-history-service/wallet-transaction-history-service";
import { MockExchangesService } from "../../../test-config/mocks/MockExchangesSevice";
import { MockWalletTransactionHistoryService } from "../../../test-config/mocks/MockWalletTransactionHistoryService";
import { TransferPage } from "../transfer/transfer";
import { IWallet } from "../../models/IWallet";
import { MockToast } from "../../../test-config/mocks/MockToast";
import { ILocalWallet } from "../../models/ILocalWallet";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockPlatform } from "../../../test-config/mocks/MockPlatform";
import { ElementRef } from "@angular/core";
import { MockAddressService } from "../../../test-config/mocks/MockAddressService";
import { AddressService } from "../../services/address-service/address-service";
import { IAddress } from "../../models/IAddress";
import { MockSettingsService } from "../../../test-config/mocks/MockSettingsService";
import { SettingsService } from "../../services/settings-service/settings-service";
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";

describe("WalletOverviewPage", () => {
    let comp: WalletOverviewPage;
    let fixture: ComponentFixture<WalletOverviewPage>;
    let navController: MockNavController;
    let toastController: MockToastController;
    let walletService: IWalletService;
    let loadingController: MockLoadingController;
    let alertController: MockAlertController;
    let clipBoard: Clipboard;
    let fileNative: FileNative;
    let bulkTranslateService: BulkTranslateService;
    let keystoreService: IKeyStoreService;
    let exchangeService: IExchangesService;
    let transactionHistoryService: IWalletTransactionHistoryService;
    let translateService: MockTranslateService;
    let platform: MockPlatform;
    let addressService: MockAddressService;
    let settingsService: MockSettingsService;

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
        translateService = new MockTranslateService();
        platform = new MockPlatform();
        addressService = new MockAddressService();
        settingsService = new MockSettingsService();

        TestBed.configureTestingModule({
            declarations: [WalletOverviewPage],
            imports: [
                IonicModule.forRoot(WalletOverviewPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: MockTranslationLoader },
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
                { provide: WalletService, useValue: walletService },
                { provide: TranslateService, useValue: translateService },
                { provide: Platform, useValue: platform },
                { provide: AddressService, useValue: addressService },
                { provide: SettingsService, useValue: settingsService }
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

    it("should present an alert when deleting a wallet", (done) => {
        comp.initialize().then(
            (data) => {
                let alert = new MockAlert();

                spyOn(alertController, "create").and.returnValue(alert);
                spyOn(alert, "present");

                comp.deleteWallet();

                expect(alert.present).toHaveBeenCalled();

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    })

    it("should open landing page and show a toast after deleting the last wallet", () => {
        comp.wallets = [
            getDummyWallet(),
            getDummyWallet(),
            getDummyWallet()
        ];
        spyOn(comp, "openLandingPage");
        spyOn(comp, "showToastMessage");

        comp.currentWallet = comp.wallets[0];

        let fakeWallet: ILocalWallet = {
            id: "FAKE_ID",
            keyStore: {
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText: "JIH",
                controlHash: "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼"
                },
            },
            lastUpdateTime: null,
            name: "FAKE_WALLET",
            publicKey: "FAKE_PUBLIC_KEY",
            type: "local"
        }
        expect(comp.wallets.length).toBe(3);
        comp.deleteSelectedWallet(fakeWallet);
        expect(comp.wallets.length).toBe(3);

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
    });

    it("should return undefined because there is no current wallet", () => {
        expect(comp.currentWallet).toBeUndefined();
    })

    it("should return undefined data after calculating the picked currency values because there is no picked currency", (done) => {
        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(data).toBeUndefined();

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
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

    it("should have three correct wallets after getting the wallets", (done) => {
        spyOn(comp, "getWalletBalance");
        comp.getAllWallets().then(
            () => {
                let one = getDummyWallet();
                one.name = "Hosha";
                let two = getDummyWallet();
                two.name = "Bosha"
                let three = getDummyWallet();
                three.name = "Losha"
                expect(comp.wallets).toEqual(<any>[
                    one,
                    two,
                    three]);
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    })

    it("should have five specific currency arrays after getting the available currencies data with mocked data", (done) => {
        comp.getAvailableExchanges().then(
            (data) => {
                expect(comp.availableExchanges[0].availableCurrencies).toEqual(["USD", "ETH", "BTC", "XSM"]);
                expect(comp.availableExchanges[1].availableCurrencies).toEqual(["USD", "BTC", "XSM"]);
                expect(comp.availableExchanges[2].availableCurrencies).toEqual(["USD", "XSM"]);
                expect(comp.availableExchanges[3].availableCurrencies).toEqual(["USD", "XSM"]);
                expect(comp.availableExchanges[4].availableCurrencies).toEqual(["USD", "ETH", "BTC", "XSM"]);

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    })

    it("should get two specific currency types and amounts back after getting it with mock data", (done) => {
        let dummyAddress: IAddress = {
            publickey: "PUBLIC_KEY",
            balances: {
                "000x00123": new FixedBigNumber(1000, 0)
            },
            signatureCount: -1
        };

        spyOn(addressService, "get").and.returnValue(Promise.resolve(dummyAddress));

        comp.wallets = [getDummyWallet()];
        comp.getWalletBalance("I EXIST").then(
            (data) => {
                expect(comp.balances[0].currency).toBe("XSM");
                expect(comp.balances[0].amount.eq(1000)).toBeTruthy();
                expect(comp.balances[1].currency).toBe("XSP");
                expect(comp.balances[1].amount.eq(0)).toBeTruthy();

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should contain correct data for graph", (done) => {
        comp.wallets = [getDummyWallet()];
        comp.currentWallet = comp.wallets[0];
        comp.pickedCurrency = "USD";
        comp.pickedExchange = "GDAX";
        comp.balances = [{ currency: "XSM", amount: new FixedBigNumber(5712, 0), valueAmount: new FixedBigNumber(0, 0) },
        { currency: "XSP", amount: new FixedBigNumber(234, 18), valueAmount: new FixedBigNumber(0, 18) }];
        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(comp.currenciesForDoughnutCanvas.length).toBe(2);
                expect(comp.currenciesForDoughnutCanvas[0]).toBe(96.06);
                expect(comp.currenciesForDoughnutCanvas[1]).toBe(3.94);
                expect(comp.currenciesForDoughnutCanvasLabels.length).toBe(2);
                expect(comp.currenciesForDoughnutCanvasLabels[0]).toBe("XSM");
                expect(comp.currenciesForDoughnutCanvasLabels[1]).toBe("XSP");

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should have five transaction histories for the wallet", (done) => {
        comp.getTransactionHistory("ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ").then(
            (data) => {
                expect(comp.transactionsHistory.length).toBe(5);
                expect(comp.transactionsHistory).toEqual(<any>[
                    { "date": "Jun 14, 2018 18:01:44 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "17srYd7sVwKgE5ha7ZXSBxUACjm2hMVQeH", "amount": "55", "currency": "XSM" },
                    { "date": "Jun 13, 2018 19:14:34 PM", "input": "1KkPiyNvRHsWC67KgK6AFHMWoxmcGm5d1H", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "292", "currency": "XSP" },
                    { "date": "Jun 08, 2018 15:44:36 PM", "input": "1LtqTERxw4QFLCbfLgB43P1XGAWUNmk6DA", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "122", "currency": "XSM" },
                    { "date": "May 28, 2018 17:22:53 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "1AvAvNh6PjzN9jjhUNhT5DuzMPgnhM6R2u", "amount": "254", "currency": "XSM" },
                    { "date": "May 26, 2018 23:44:51 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "13QMZULQGBodKzsAF462Dh2opf8PQawYBt", "amount": "5192", "currency": "XSP" },
                ]);
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should call initialize when the view is loaded", () => {
        spyOn(comp, "initialize");

        comp.ionViewDidLoad();

        expect(comp.initialize).toHaveBeenCalled();
    });

    it("should open the transfer page correctly", () => {
        spyOn(navController, "push");

        comp.currentWallet = getDummyWallet();
        comp.balances = [{ currency: "XSM", amount: new FixedBigNumber(550, 0), valueAmount: new FixedBigNumber(0.25, 0) },
        { currency: "XSP", amount: new FixedBigNumber(4723, 18), valueAmount: new FixedBigNumber(0.025, 0) }];

        comp.openTransferPage();

        expect(navController.push).toHaveBeenCalledWith(TransferPage, { currentWallet: getDummyWallet(), currentWalletBalance: comp.balances });
    })

    it("should call balance and history after refreshing the wallet", () => {
        spyOn(comp, "getWalletBalance");
        spyOn(comp, "getTransactionHistory");

        comp.currentWallet = <IWallet>{};
        comp.currentWallet.publicKey = "";

        comp.refreshWalletInfo();

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

    it("should trigger the subscribe of the language change and call retrieveTranslations to retrieve the translations of the selected language", (done) => {
        spyOn(comp, "retrieveTranslations");

        comp.getAndSubscribeToTranslations();

        translateService.use("nl");

        expect(comp.retrieveTranslations).toHaveBeenCalled();
        done();
    });

    it("should return false because the wallet type is not local", () => {
        let wallet = getDummyWallet();
        wallet.type = <any>"NOT_LOCAL";
        comp.currentWallet = wallet;
        expect(comp.exportModal("file")).toBeFalsy();
    });

    it("should create the alert modal properly", () => {
        let alert = new MockAlert();
        comp.currentWallet = getDummyWallet();
        spyOn(alertController, "create").and.returnValue(alert);
        spyOn(alert, "setTitle");
        spyOn(alert, "addInput");
        spyOn(alert, "addButton");
        spyOn(alert, "present");
        comp.exportModal("");
        expect(alertController.create).toHaveBeenCalled();
        expect(alert.setTitle).toHaveBeenCalledWith("");
        expect(alert.addInput).toHaveBeenCalledWith({
            type: "radio",
            label: comp.translations.get("wallet_overview.copy_clipboard"),
            value: "clipboard",
            checked: false
        });
        expect(alert.addInput).toHaveBeenCalledWith({
            type: "radio",
            label: comp.translations.get("wallet_overview.download_file"),
            value: "file",
            checked: true
        });
        expect(alert.addButton).toHaveBeenCalledWith(comp.translations.get("wallet_overview.cancel"));
        expect(alert.present).toHaveBeenCalled();
    });

    it("should get specific different translations for export type", () => {
        comp.currentWallet = getDummyWallet();
        spyOn(comp.translations, "get");

        comp.exportModal("keystore");

        expect(comp.translations.get).toHaveBeenCalledWith("wallet_overview.export_keystore");

        comp.exportModal("privatekey");

        expect(comp.translations.get).toHaveBeenCalledWith("wallet_overview.export_privatekey");
    });

    it("shouldn't do anything since the export type is not defined", () => {
        spyOn(comp, "export");
        spyOn(alertController, "create");

        comp.handleExportModalClick("", "");

        expect(comp.export).not.toHaveBeenCalled();
        expect(alertController.create).not.toHaveBeenCalled();
    });

    it("should pass along the export as keystore properly", () => {
        comp.currentWallet = getDummyWallet();
        spyOn(comp, "export");

        comp.handleExportModalClick("DATA_TYPE", "keystore");

        expect(comp.export).toHaveBeenCalledWith("DATA_TYPE", JSON.stringify({
            cipher: "AES-CTR",
            cipherParams: {
                iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
            },
            cipherText: "JIH",
            controlHash: "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
            keyParams: {
                iterations: 128,
                keySize: 32,
                salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼"
            }
        }), "keystore");
    });

    it("should create a modal to enter the password for privatekey export", () => {
        let alert = new MockAlert();
        comp.currentWallet = getDummyWallet();

        spyOn(alertController, "create").and.returnValue(alert);
        spyOn(alert, "present");

        comp.handleExportModalClick("DATA_TYPE", "privatekey");

        expect(alertController.create).toHaveBeenCalled();

        expect(alert.present).toHaveBeenCalled();
    });

    it("should not copy to any platform since the dataType is not defined", () => {
        spyOn(comp, "copyToClipboardWeb");
        spyOn(comp, "showToastMessage");
        spyOn(comp, "writeFileMobile");
        spyOn(comp, "downloadTxtFileWeb");

        comp.export("", "data", "keystore");

        expect(comp.copyToClipboardWeb).not.toHaveBeenCalled();
        expect(comp.showToastMessage).not.toHaveBeenCalled();
        expect(comp.writeFileMobile).not.toHaveBeenCalled();
        expect(comp.downloadTxtFileWeb).not.toHaveBeenCalled();
    });

    it("should use the clipboard library to copy the files when the platform is android or ios", () => {
        spyOn(clipBoard, "copy");
        spyOn(platform, "is").and.returnValue(true);

        comp.export("clipboard", "data", "keystore");

        expect(clipBoard.copy).toHaveBeenCalledWith("data");
    });

    it("should use the javascript way to copy the files to the clipboard because the platform is something else than android or ios", () => {
        spyOn(platform, "is").and.returnValue(false);
        spyOn(comp, "copyToClipboardWeb");

        comp.export("clipboard", "data", "keystore");

        expect(comp.copyToClipboardWeb).toHaveBeenCalledWith("data");
    });

    it("should show a toast at the bottom of the page", () => {
        spyOn(comp, "showToastMessage");

        comp.export("clipboard", "data", "keystore");

        expect(comp.showToastMessage).toHaveBeenCalled();
    });

    it("should export the file without a filename since the exportType is not a defined one", () => {
        spyOn(platform, "is").and.returnValue(false);
        spyOn(comp, "downloadTxtFileWeb");

        comp.export("file", "data", "SOMETHING_ELSE");

        expect(comp.downloadTxtFileWeb).toHaveBeenCalledWith("data", "");
    });

    it("should write the file to android storage", () => {
        comp.currentWallet = getDummyWallet();
        spyOn(platform, "is").and.callFake((value: string) => {
            return value === "android";
        });
        spyOn(comp, "writeFileMobile");
        // Filenative throws a warning that cordova isn't loaded in this unit test. We know it isn't; just don't show it.
        spyOn(console, "warn");

        comp.export("file", "data", "keystore");

        expect(comp.writeFileMobile).toHaveBeenCalledWith(jasmine.any(String),
            jasmine.any(String),
            "data",
            { replace: true },
            "android");

    });

    it("should write the file to ios storage", () => {
        comp.currentWallet = getDummyWallet();
        spyOn(platform, "is").and.callFake((value: string) => {
            return value === "ios";
        });
        spyOn(comp, "writeFileMobile");
        // Filenative throws a warning that cordova isn't loaded in this unit test. We know it isn't; just don't show it.
        spyOn(console, "warn");

        comp.export("file", "data", "keystore");

        // syncedDataDirectory returns null on non-ios devices
        expect(comp.writeFileMobile).toHaveBeenCalledWith(null,
            jasmine.any(String),
            "data",
            { replace: true },
            "ios");

    });

    it("should call the file write method and get the right translations", (done) => {
        spyOn(fileNative, "writeFile").and.callThrough();
        spyOn(comp, "writeFileMobile").and.callThrough();
        spyOn(comp, "showToastMessage");
        spyOn(comp.translations, "get").and.returnValue("");

        let iosPromise = comp.writeFileMobile("location", "filename", "keystoredata", { replace: true }, "ios").then(data => {
            expect(comp.writeFileMobile).toHaveBeenCalledWith("location", "filename", "keystoredata", { replace: true }, "ios");
            expect(comp.showToastMessage).toHaveBeenCalledWith(jasmine.any(String), 2000, "bottom");
            expect(comp.translations.get).toHaveBeenCalledWith("wallet_overview.saved_keystore_ios");
        });

        let otherPromise = comp.writeFileMobile("location", "filename", "keystoredata", { replace: true }, "android").then(data => {
            expect(comp.translations.get).toHaveBeenCalledWith("wallet_overview.saved_keystore_android");
        });
        Promise.all([iosPromise, otherPromise]).then(
            data => {
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should present a toast with a close button when the file could not be written", (done) => {
        let toast = new MockToast();

        spyOn(fileNative, "writeFile").and.returnValue(Promise.reject(""));
        spyOn(toastController, "create").and.returnValue(toast);
        spyOn(toast, "present");
        spyOn(comp.translations, "get").and.returnValue("");

        comp.writeFileMobile("location", "filename", "keystoredata", { replace: true }, "android").then(
            (data) => {
                expect(toastController.create).toHaveBeenCalledWith({
                    message: jasmine.any(String),
                    position: "bottom",
                    showCloseButton: true,
                    closeButtonText: "Ok"
                });
                expect(toast.present).toHaveBeenCalled();
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should show that there are no transactions if it returns an empty array", (done) => {
        spyOn(transactionHistoryService, "getTransactionHistory").and.returnValue(Promise.resolve({ transactions: [] }));

        comp.getTransactionHistory("").then(
            (data) => {
                expect(comp.noTransactionHistoryVisibility).toBe("shown");
                expect(comp.transactionHistoryVisibility).toBe("hidden");
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should load the balances correctly", (done) => {
        comp.currentWallet = getDummyWallet();

        let dummyAddress: IAddress = {
            publickey: "PUBLIC_KEY",
            balances: {
                "000x00123": new FixedBigNumber(1000, 0)
            },
            signatureCount: -1
        };

        spyOn(addressService, "get").and.returnValue(Promise.resolve(dummyAddress));

        comp.getWalletBalance("").then(
            (data) => {
                expect(comp.balances[0]).toEqual({ currency: "XSM", amount: new FixedBigNumber(1000, 0), valueAmount: new FixedBigNumber(1000, 0) });
                expect(comp.balances[1]).toEqual({ currency: "XSP", amount: new FixedBigNumber(0, 18), valueAmount: new FixedBigNumber(0, 18) });

                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should set the currencies correct for the picked exchange and picked currency", () => {
        spyOn(comp, "setCalculatedCurrencyValue");

        comp.pickedExchange = "Exchange1";
        comp.pickedCurrency = "Curr3";
        comp.availableExchanges = [
            { "exchangeName": "Exchange1", "availableCurrencies": ["Curr1", "Curr2", "Curr3", "Curr4"] },
            { "exchangeName": "Exchange2", "availableCurrencies": ["Curr1", "Curr2", "Curr3"] },
            { "exchangeName": "Exchange3", "availableCurrencies": ["Curr1", "Curr2"] },
            { "exchangeName": "Exchange4", "availableCurrencies": ["Curr1", "Curr2"] },
            { "exchangeName": "Exchange5", "availableCurrencies": ["Curr1", "Curr2", "Curr3", "Curr4"] }
        ];

        comp.setExchange();

        expect(comp.setCalculatedCurrencyValue).toHaveBeenCalled();
        expect(comp.pickedCurrency).toBe("Curr3");
        expect(comp.currentExchangeCurrencies).toEqual(["Curr1", "Curr2", "Curr3", "Curr4"]);
    });

    it("should set the currency to the first one if it doesn't exist on the exchange", () => {
        spyOn(comp, "setCalculatedCurrencyValue");

        comp.pickedExchange = "Exchange1";
        comp.pickedCurrency = "Curr3";
        comp.availableExchanges = [
            { "exchangeName": "Exchange1", "availableCurrencies": ["Curr1", "Curr2", "Curr3", "Curr4"] },
            { "exchangeName": "Exchange2", "availableCurrencies": ["Curr1", "Curr2", "Curr3"] },
            { "exchangeName": "Exchange3", "availableCurrencies": ["Curr1", "Curr2"] },
            { "exchangeName": "Exchange4", "availableCurrencies": ["Curr1", "Curr2"] },
            { "exchangeName": "Exchange5", "availableCurrencies": ["Curr1", "Curr2", "Curr3", "Curr4"] }
        ];

        comp.pickedCurrency = "DON'T EXIST";

        comp.setExchange();

        expect(comp.pickedCurrency).toBe("Curr1");
    });

    it("should refresh the balance and history on wallet change", () => {
        spyOn(comp, "getWalletBalance");
        spyOn(comp, "getTransactionHistory");

        comp.currentWallet = getDummyWallet();
        comp.onWalletChanged();

        expect(comp.getWalletBalance).toHaveBeenCalledWith("S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64", true);
        expect(comp.getTransactionHistory).toHaveBeenCalledWith("S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64");
    });

    it("should create a new chart with correct legend", () => {
        comp.currenciesForDoughnutCanvasLabels = ["Label1", "Label2", "Label3"];
        comp.currenciesForDoughnutCanvas = [10, 20, 30];

        var dummyElement = document.createElement('canvas');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        comp.doughnutCanvas = new ElementRef("");
        comp.doughnutCanvas.nativeElement = document.getElementById("");
        comp.displayChart();
        expect(comp.doughnutChart).toBeDefined();
        let legend = comp.doughnutChart.generateLegend();
        expect(legend[0]).toEqual({ backgroundColor: '#064C70', label: 'Label1', data: 10 });
        expect(legend[1]).toEqual({ backgroundColor: '#1B79A9', label: 'Label2', data: 20 });
        expect(legend[2]).toEqual({ backgroundColor: '#d0ff00', label: 'Label3', data: 30 });
    });

    it("should not try to generate the dougnut chart because needed information is missing for the chart", () => {
        comp.currenciesForDoughnutCanvas = undefined;
        comp.currenciesForDoughnutCanvasLabels = undefined;
        comp.doughnutCanvas = undefined;

        comp.displayChart();

        expect(comp.doughnutChart).toBeUndefined();
    });

    it("should destroy the chart first before re-building if it exists already", (done) => {
        spyOn(comp, "setCalculatedCurrencyValue").and.callThrough();

        comp.pickedCurrency = "Curr1";
        comp.pickedExchange = "Exchange1";
        comp.balances = [
            { currency: "XSM", amount: new FixedBigNumber(0, 0), valueAmount: new FixedBigNumber(0, 0) },
            { currency: "XSP", amount: new FixedBigNumber(0, 18), valueAmount: new FixedBigNumber(0, 18) }
        ];
        comp.currentWallet = getDummyWallet();
        comp.currenciesForDoughnutCanvasLabels = ["Label1", "Label2", "Label3"];
        comp.currenciesForDoughnutCanvas = [10, 20, 30];

        var dummyElement = document.createElement('canvas');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        comp.doughnutCanvas = new ElementRef("");
        comp.doughnutCanvas.nativeElement = document.getElementById("");
        comp.displayChart();

        expect(comp.doughnutChart).toBeDefined();

        let destroySpy = spyOn(comp.doughnutChart, "destroy");

        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(destroySpy).toHaveBeenCalled();
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should set the currency value equal to the amount if it's the same currency to calculate as picked", (done) => {
        spyOn(comp, "setCalculatedCurrencyValue").and.callThrough();
        spyOn(exchangeService, "getPrices").and.callThrough();

        comp.currentWallet = getDummyWallet();
        comp.pickedCurrency = "XSM";
        comp.pickedExchange = "GDAX";
        comp.balances = [
            { currency: "XSM", amount: new FixedBigNumber(5, 0), valueAmount: new FixedBigNumber(0, 0) },
            { currency: "XSP", amount: new FixedBigNumber(100, 18), valueAmount: new FixedBigNumber(0, 18) }
        ];

        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(comp.balances[0].amount.eq(5)).toBeTruthy();
                expect(comp.balances[0].valueAmount.eq(5)).toBeTruthy();
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should create an alert telling the user the currency value could not be calculated", (done) => {
        let alert = new MockAlert();

        spyOn(comp, "setCalculatedCurrencyValue").and.callThrough();
        spyOn(exchangeService, "getPrices").and.callThrough()
        spyOn(alertController, "create").and.returnValue(alert);
        spyOn(alert, "present");

        comp.currentWallet = getDummyWallet();
        comp.pickedCurrency = "I DON'T EXIST";
        comp.pickedExchange = "ME NEITHER";
        comp.balances = [{ currency: "XSM", amount: new FixedBigNumber(5, 0), valueAmount: new FixedBigNumber(0, 0) },
        { currency: "XSP", amount: new FixedBigNumber(100, 18), valueAmount: new FixedBigNumber(0, 0) }];

        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(alertController.create).toHaveBeenCalled();
                expect(alert.present).toHaveBeenCalled();
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("should set distribution amount to 50 for each currency (if there are 2 currencies) if the currency amount is 0", (done) => {
        spyOn(comp, "setCalculatedCurrencyValue").and.callThrough();
        spyOn(exchangeService, "getPrices").and.callThrough()

        comp.currentWallet = getDummyWallet();
        comp.pickedCurrency = "XSM";
        comp.pickedExchange = "GDAX";
        comp.balances = [{ currency: "XSM", amount: new FixedBigNumber(0, 0), valueAmount: new FixedBigNumber(0, 0) },
        { currency: "XSP", amount: new FixedBigNumber(0, 18), valueAmount: new FixedBigNumber(0, 18) }];

        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(comp.currenciesForDoughnutCanvas[0]).toBe(50);
                expect(comp.currenciesForDoughnutCanvas[1]).toBe(50);
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    it("it should generate a legend when calculating the currency values and dismiss the loading modal", (done) => {
        let alert = new MockAlert();

        spyOn(comp, "setCalculatedCurrencyValue").and.callThrough();
        spyOn(exchangeService, "getPrices").and.callThrough();
        spyOn(loadingController, "create").and.returnValue(alert);
        spyOn(alert, "present");

        comp.currenciesForDoughnutCanvasLabels = ["Label1", "Label2", "Label3"];
        comp.currenciesForDoughnutCanvas = [10, 20, 30];
        comp.loading = loadingController.create({
            content: "LOADING_CONTENT"
        });
        comp.loading.present();

        var dummyElement = document.createElement('canvas');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        comp.doughnutCanvas = new ElementRef("");
        comp.doughnutCanvas.nativeElement = document.getElementById("");
        comp.displayChart();

        // In the method setCalculatedCurrencyValue the display chart will be called again but we don't want it to overwrite our spy
        spyOn(comp, "displayChart");
        expect(comp.doughnutChart).toBeDefined();

        let doughnutChartSpy = spyOn(comp.doughnutChart, "generateLegend");

        comp.currentWallet = getDummyWallet();
        comp.pickedCurrency = "XSM";
        comp.pickedExchange = "GDAX";
        comp.balances = [{ currency: "XSM", amount: new FixedBigNumber(0, 0), valueAmount: new FixedBigNumber(0, 0) },
        { currency: "XSP", amount: new FixedBigNumber(0, 18), valueAmount: new FixedBigNumber(0, 18) }];

        comp.setCalculatedCurrencyValue().then(
            (data) => {
                expect(doughnutChartSpy).toHaveBeenCalled();
                expect(loadingController.create).toHaveBeenCalled();
                expect(alert.present).toHaveBeenCalled();
                done();
            },
            (error) => {
                console.error(error);
                expect(true).toBeFalsy(error);
                done();
            }
        );
    });

    function getDummyWallet() {
        return JSON.parse(JSON.stringify({
            id: "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: {
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText: "JIH",
                controlHash: "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼"
                },
            },
            lastUpdateTime: null,
            name: "Bosha",
            publicKey: "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type: "local"
        }));
    }
});