import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, LoadingController, Loading, Alert, Platform } from "ionic-angular";
import { Chart } from "chart.js";
import { WalletService } from "../../services/wallet-service/wallet-service";
import { AlertController } from "ionic-angular";
import { trigger, state, style } from "@angular/animations";
import { LandingPage } from "../landing/landing";
import { ToastController } from "ionic-angular";
import { TransferPage } from "../transfer/transfer";
import { IAvailableExchange } from "../../models/IAvailableExchange";
import { File as FileNative } from "@ionic-native/file";
import { Clipboard } from "@ionic-native/clipboard";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { TranslateService } from "@ngx-translate/core";
import { IBalance } from "../../models/IBalance";
import { ExchangesService } from "../../services/exchanges-service/exchanges-service";
import { WalletTransactionHistoryService } from "../../services/wallet-transaction-history-service/wallet-transaction-history-service";
import { AddressService } from "../../services/address-service/address-service";
import { SettingsService } from "../../services/settings-service/settings-service";
import { RequestPage } from "../request/request";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export declare type VisibilityType = "shown" | "hidden";

export interface IWriteOptions {
    replace?: boolean;
    append?: boolean;
    truncate?: number;
}

@IonicPage()
@Component({
    selector: "page-wallet-overview",
    templateUrl: "wallet-overview.html",
    animations: [
        trigger("visibilityChanged", [
            state("shown", style({ opacity: 1 })),
            state("hidden", style({ opacity: 0, display: "none" }))
        ])
    ]
})
export class WalletOverviewPage {
    @ViewChild("doughnutCanvas") doughnutCanvas: any;
    /**
     * The picked currency for the shown values
     */
    pickedCurrency: string;
    /**
     * The picked exchange to show
     */
    pickedExchange: string;
    /**
     * The chart to show the currencies distribution
     */
    doughnutChart: Chart;
    /**
     * All of the wallets
     */
    wallets: Smilo.IWallet[] = [];
    /**
     * The currency in amounts to show on the chart
     */
    currenciesForDoughnutCanvas: number[] = [];
    /**
     * The currency labels to show on the chart
     */
    currenciesForDoughnutCanvasLabels: string[] = [];
    /**
     * The current selected wallet
     */
    currentWallet: Smilo.IWallet;
    /**
     * The current selected wallet index
     */
    currentWalletIndex: number = 0;
    /**
     * The legend labels + amount list to show underneith the distribution chart
     */
    legendList: string[] = [];
    /**
     * The list of the available exchanges to pick from
     */
    availableExchanges: IAvailableExchange[] = [];
    /**
     * The list of available currencies for the picked exchange
     */
    currentExchangeCurrencies: string[] = [];
    /**
     * The transaction history for the current wallet
     */
    transactionsHistory: Smilo.ITransaction[] = [];
    /**
     * Status to show the funds for the switch
     */
    showFundsStatus: boolean = true;
    /**
     * Visibility connection for the UI funds
     */
    walletFundsVisibility: VisibilityType = "shown";
    /**
     * Visiblity connection for the UI transfer button
     */
    walletFundsVisibilityTransferButton: VisibilityType = "hidden";
    /**
     * Visiblity connection for the message of no transaction history UI
     */
    noTransactionHistoryVisibility: VisibilityType = "shown";
    /**
     * Visiblity connection for the transaction history
     */
    transactionHistoryVisibility: VisibilityType = "hidden";
    /**
     * The loading modal
     */
    loading: Loading;
    /**
     * The loading error modal
     */
    loadingError: Alert;
    /**
     * The total value of all combined currencies and exchange
     */
    totalCurrentCurrencyValue: string;
    /**
     * List of translations set programmatically
     */
    translations: Map<string, string> = new Map<string, string>();
    /**
     * Current wallet balances
     */
    balances: IBalance[];
    initialized = false;
    loadingModalOpen = false;

    private readonly refreshIntervalTime: number = 2500;

    private encryptionHelper = new Smilo.EncryptionHelper();

    /**
     * The scheduler timer interval. We store this value so we can
     * clear the interval at a later time.
     */
    interval: any;

    constructor(private navCtrl: NavController,
        private platform: Platform,
        private walletService: WalletService,
        private translateService: TranslateService,
        private bulkTranslateService: BulkTranslateService,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private settingsService: SettingsService,
        private clipboard: Clipboard,
        private fileNative: FileNative,
        private exchangeService: ExchangesService,
        private transactionHistoryService: WalletTransactionHistoryService,
        private addressService: AddressService) {

    }

    /**
     * Schedules an interval which will periodically update the balance of the active wallet.
     */
    scheduleRefreshInterval() {
        this.interval = setInterval(() => this.refreshWalletInfo(true), this.refreshIntervalTime);
    }

    /**
     * Clears the scheduled update interval.
     */
    clearRefreshInterval() {
        clearInterval(this.interval);
    }

    /**
     * Gets the translations to set programmatically
     */
    retrieveTranslations(): Promise<Map<string, string>> {
        return this.bulkTranslateService.getTranslations([
            "wallet_overview.error",
            "wallet_overview.error_retrieving_data",
            "wallet_overview.click_retry",
            "wallet_overview.export_privatekey",
            "wallet_overview.download_file",
            "wallet_overview.copy_clipboard",
            "wallet_overview.cancel",
            "wallet_overview.export_privatekey",
            "wallet_overview.password_placeholder",
            "wallet_overview.continue",
            "wallet_overview.incorrect_password",
            "wallet_overview.export_keystore",
            "wallet_overview.saved_keystore_ios",
            "wallet_overview.saved_keystore_android",
            "wallet_overview.first_start_keystore_download",
            "wallet_overview.no_cancel",
            "wallet_overview.yes_delete",
            "wallet_overview.delete_wallet",
            "wallet_overview.loading_wallet",
            "wallet_overview.currency_value_zero",
            "wallet_overview.copied_public_key",
            "wallet_overview.copy_public_key"
        ]).then(data => {
            this.translations = data;
            return data;
        });
    }

    /**
     * Returns a promise when initialization is done
     */
    initialize(): Promise<void> {
        return Promise.all([
            this.getAllWallets(),
            this.getAvailableExchanges()]).then(
                (data) => { this.initialized = true; },
                (error) => {
                    this.dismissLoadingModal();
                    const confirm = this.alertCtrl.create({
                        title: this.translations.get("wallet_overview.error"),
                        message: this.translations.get("wallet_overview.error_retrieving_data"),
                        buttons: [
                            {
                                text: this.translations.get("wallet_overview.click_retry"),
                                handler: () => {
                                    this.initialize();
                                }
                            }
                        ]
                    });
                    confirm.present();
                });
    }

    getAndSubscribeToTranslations(): void {
        this.translateService.onLangChange.subscribe(data => {
            this.retrieveTranslations();
        });
        this.retrieveTranslations();
    }

    getAndSubscribeToFundsSwitch(): void {
        this.settingsService.getFundsSwitchStatus().subscribe(data => {
            if (data) {
                this.walletFundsVisibility = "shown";
                this.walletFundsVisibilityTransferButton = "hidden";
            } else {
                this.walletFundsVisibility = "hidden";
                this.walletFundsVisibilityTransferButton = "shown";
            }
        })
    }

    /**
     * Called whenever the view is loaded
     */
    ionViewDidLoad(): void {
        this.getAndSubscribeToTranslations();
        this.getAndSubscribeToFundsSwitch();
        this.initialize();
    }

    /**
     * Called when the user enters this view.
     */
    ionViewDidEnter(): void {
        this.scheduleRefreshInterval();
    }

    /**
     * Called when the user leaves this view.
     */
    ionViewDidLeave(): void {
        this.clearRefreshInterval();
    }

    /**
     * Open the transfer page
     */
    openTransferPage(): void {
        this.navCtrl.push(TransferPage, { currentWallet: this.currentWallet, currentWalletBalance: this.balances });
    }

    /**
     * Open the request page
     */
    openRequestPage(): void {
        this.navCtrl.push(RequestPage, { currentWallet: this.currentWallet, currentWalletBalance: this.balances });
    }

    /**
     * Creates a modal to export the keystore
     */
    exportModal(exportType): boolean {
        if (this.currentWallet.type !== "local") {
            return false;
        }
        let title = "";
        if (exportType === "keystore") {
            title = this.translations.get("wallet_overview.export_keystore");
        } else if (exportType === "privatekey") {
            title = this.translations.get("wallet_overview.export_privatekey");
        }
        let alert = this.alertCtrl.create();
        alert.setTitle(title);
        alert.addInput({
            type: "radio",
            label: this.translations.get("wallet_overview.download_file"),
            value: "file",
            checked: true
        });
        alert.addInput({
            type: "radio",
            label: this.translations.get("wallet_overview.copy_clipboard"),
            value: "clipboard",
            checked: false
        });
        alert.addButton(this.translations.get("wallet_overview.cancel"));
        alert.addButton({
            text: "OK",
            handler: dataType => {
                this.handleExportModalClick(dataType, exportType);
            }
        });
        alert.present();
    }

    handleExportModalClick(dataType, exportType) {
        if (exportType === "keystore") {
            let keystoreData = JSON.stringify((this.currentWallet as Smilo.ILocalWallet).keyStore);
            this.export(dataType, keystoreData, "keystore");
        } else if (exportType === "privatekey") {
            let keystoreDataObj = (this.currentWallet as Smilo.ILocalWallet).keyStore;
            const prompt = this.alertCtrl.create({
                title: this.translations.get("wallet_overview.export_privatekey"),
                inputs: [
                    {
                        name: "password",
                        placeholder: this.translations.get("wallet_overview.password_placeholder"),
                        type: "password"
                    },
                ],
                buttons: [
                    {
                        text: this.translations.get("wallet_overview.cancel"),
                        handler: data => { }
                    },
                    {
                        text: this.translations.get("wallet_overview.continue"),
                        handler: data => {
                            let result = this.encryptionHelper.decryptKeyStore(keystoreDataObj, data.password);
                            if (result === null) {
                                this.showToastMessage(this.translations.get("wallet_overview.incorrect_password"), 5000, "bottom");
                            } else {
                                this.export(dataType, result, "privatekey");
                            }
                        }
                    }
                ]
            });
            prompt.present();
        }
    }

    copyPublicKey(): void {
        if (this.platform.is("android") || this.platform.is("ios")) {
            this.clipboard.copy(this.currentWallet.publicKey);
        } else {
            this.copyToClipboardWeb(this.currentWallet.publicKey);
        }
        this.translateService.get("wallet_overview.copied_public_key", { publicKey: this.currentWallet.publicKey }).subscribe(
            (translation) => {
                this.showToastMessage(translation, 3000, "bottom");
            }
        );
    }

    /**
     * Exports the wallet
     * @param dataType Either file or clipboard
     * @param data The data to export
     * @param exportType Either keystore or privatekey
     */
    export(dataType, data, exportType): void {
        if (dataType === "clipboard") {
            if (this.platform.is("android") || this.platform.is("ios")) {
                this.clipboard.copy(data);
            } else {
                this.copyToClipboardWeb(data);
            }
            this.translateService.get("wallet_overview.copied_to_clipboard", { export_type: exportType }).subscribe(
                (translation) => {
                    this.showToastMessage(translation, 2000, "bottom");
                }
            );
        } else if (dataType === "file") {
            let filename = "";
            if (exportType === "keystore") {
                filename = ("UTC--" + new Date().toISOString() + "--" + this.currentWallet.publicKey).replace(/:/g, "-");
            } else if (exportType === "privatekey") {
                filename = ("PVK--" + this.currentWallet.publicKey).replace(/:/g, "-");
            }
            let options: IWriteOptions = { replace: true };
            if (this.platform.is("android")) {
                let storageLocation = this.fileNative.externalRootDirectory + "Download";
                this.writeFileMobile(storageLocation, filename, data, options, "android");
            } else if (this.platform.is("ios")) {
                let storageLocation = this.fileNative.syncedDataDirectory;
                this.writeFileMobile(storageLocation, filename, data, options, "ios");
            } else {
                this.downloadTxtFileWeb(data, filename);
            }
        }
    }

    /**
     * Copies the data to the clipboard for web
     * @param data The data to copy
     */
    copyToClipboardWeb(data): void {
        var dummyElementToCopyText = document.createElement("input");
        document.body.appendChild(dummyElementToCopyText);
        dummyElementToCopyText.setAttribute("value", data);
        dummyElementToCopyText.select();
        document.execCommand("copy");
        document.body.removeChild(dummyElementToCopyText);
    }

    /**
     * Downloads the data as file
     * @param data The data to export
     * @param filename The filename to set
     */
    downloadTxtFileWeb(data, filename): void {
        var dummyElementToDownload = document.createElement("a");
        dummyElementToDownload.setAttribute("href", "data:text/plain;charset=utf-8," + data);
        dummyElementToDownload.setAttribute("download", filename);
        dummyElementToDownload.style.display = "none";
        document.body.appendChild(dummyElementToDownload);
        dummyElementToDownload.click();
        document.body.removeChild(dummyElementToDownload);
    }

    /**
     * Helper method to show a toast
     * @param toastMessage The message to show as text inside the toast
     * @param duration The duration of the toast to last
     * @param position The position of the toast to show
     */
    showToastMessage(toastMessage, duration, position): void {
        let toast = this.toastCtrl.create({
            message: toastMessage,
            duration: duration,
            position: position
        });
        toast.present(toast);
    }

    /**
     * Writes the file to the storage
     * @param storageLocation Location where to store the file
     * @param filename The name of the file to store
     * @param keystoreData The keystoredata to store
     * @param options Options to overwrite existing file name
     * @param os Either android or ios
     */
    writeFileMobile(storageLocation, filename, keystoreData, options, os): Promise<any> {
        return this.fileNative.writeFile(storageLocation, filename, keystoreData, options).then(data => {
            let toastMessage = "";
            if (os === "ios") {
                toastMessage = this.translations.get("wallet_overview.saved_keystore_ios");
            } else {
                toastMessage = this.translations.get("wallet_overview.saved_keystore_android");
            }
            this.showToastMessage(toastMessage, 2000, "bottom");
        }).catch(error => {
            let toast = this.toastCtrl.create({
                message: this.translations.get("wallet_overview.first_start_keystore_download"),
                position: "bottom",
                showCloseButton: true,
                closeButtonText: "Ok"
            });
            toast.present(toast);
        });
    }

    /**
     * Open a modal to delete the wallet
     */
    deleteWallet(): void {
        this.translateService.get("wallet_overview.delete_wallet_confirmation", { wallet_name: this.currentWallet.name, publickey: this.currentWallet.publicKey }).subscribe(
            (translation) => {
                const confirm = this.alertCtrl.create({
                    title: this.translations.get("wallet_overview.delete_wallet"),
                    message: translation,
                    buttons: [
                        {
                            text: this.translations.get("wallet_overview.no_cancel"),
                            handler: () => { }
                        },
                        {
                            text: this.translations.get("wallet_overview.yes_delete"),
                            cssClass: "delete-button",
                            handler: () => {
                                this.walletService.remove(this.currentWallet);
                                this.deleteSelectedWallet(this.currentWallet);
                            }
                        }
                    ]
                });
                confirm.present();
            }
        );
    }

    /**
     * Delete a wallet from the UI and local database
     * @param wallet The wallet to delete
     */
    deleteSelectedWallet(wallet: Smilo.IWallet): void {
        let index = this.wallets.indexOf(wallet);
        if (index !== -1) {
            this.wallets.splice(index, 1);
            if (this.wallets.length > 0) {
                this.currentWallet = this.wallets[0];
            } else {
                this.openLandingPage();
                this.showToastMessage(this.translations.get("deleted_all_wallets"), 5000, "bottom");
            }
        }
    }

    /**
     * Retrieves the transaction history for the current wallet
     * @param publicKey
     */
    getTransactionHistory(publicKey: string): Promise<void> {
        return this.transactionHistoryService.getTransactionHistory(publicKey, 0, 10, true).then(data => {
            this.transactionsHistory = data.transactions;
            this.transactionsHistory.forEach (
              history => {
                if (history.assetId === "0x000000536d696c6f") { history.assetId = "XSM";}
                else if (history.assetId === "0x536d696c6f506179") { history.assetId = "XSP";}
                else { history.assetId = "UNKNOWN";}
              }
            )
            if (this.transactionsHistory.length > 0) {
                this.noTransactionHistoryVisibility = "hidden";
                this.transactionHistoryVisibility = "shown";
            } else {
                this.noTransactionHistoryVisibility = "shown";
                this.transactionHistoryVisibility = "hidden";
            }
        });
    }

    /**
     * Retrieve all wallets saved in the local database
     */
    getAllWallets(): Promise<void> {
        return this.walletService.getAll().then(data => {
            this.wallets = data;
            this.currentWallet = this.wallets[0];
        });
    }

    /**
     * Get all available exchanges that support XSM and XMP and their corresponding available currencies
     */
    getAvailableExchanges(): Promise<void> {
        return this.exchangeService.getAvailableExchanges().then(data => {
            if (data.availableExchanges !== undefined) {
                for (let exchange of data.availableExchanges) {
                    this.availableExchanges.push(exchange);
                }
                this.pickedExchange = this.availableExchanges[0].exchangeName;
                this.pickedCurrency = this.availableExchanges[0].availableCurrencies[0];
                this.currentExchangeCurrencies = this.availableExchanges[0].availableCurrencies;
            }
        });
    }

    /**
     * Retrieve the wallet balance
     * @param publicKey The public key of the wallet to retrieve the balance
     */
    getWalletBalance(publicKey: string, silent?: boolean): Promise<void> {
        return this.addressService.get(publicKey).then(
            (address) => {
                this.balances = [
                    {
                        currency: "XSM", amount: address.balances["0x000000536d696c6f"], valueAmount: address.balances["0x000000536d696c6f"]
                    },
                    {
                        currency: "XSP", amount: address.balances["0x536d696c6f506179"], valueAmount: address.balances["0x536d696c6f506179"]
                    }
                ];

                this.setCalculatedCurrencyValue(silent);
            }
        );
    }

    /**
     * Change the current exchange and set the currency values for that exchange
     */
    setExchange(): void {
        this.currentExchangeCurrencies = this.availableExchanges.find(exchange => exchange.exchangeName === this.pickedExchange).availableCurrencies;
        let index = this.currentExchangeCurrencies.indexOf(this.pickedCurrency);
        if (index === -1) {
            this.pickedCurrency = this.currentExchangeCurrencies[0];
        }
        this.setCalculatedCurrencyValue();
    }

    /**
     * Get the amount of decimals. Using a shorter decimal amount for FIAT
     */
    getFixedNumbers() {
        let fixedNumbers = 7;
        if (this.pickedCurrency === "USD" ||
            this.pickedCurrency === "EUR") {
            fixedNumbers = 2;
        }
        return fixedNumbers;
    }

    /**
     * Set the currency values calculated on the exchange, currency and amount of coins
     */
    setCalculatedCurrencyValue(animated?: boolean): Promise<void> {
        if (this.pickedCurrency === undefined ||
            this.currentWallet === undefined ||
            this.pickedExchange === undefined ||
            this.balances === undefined) {
            // Nothing to do
            return Promise.resolve();
        }

        return this.exchangeService.getPrices(this.pickedCurrency, this.pickedExchange).then(data => {
            let prices = data;
            let totalValue = new Smilo.FixedBigNumber(0, 0);
            let totalCurrencies = new Smilo.FixedBigNumber(0, 0);
            this.currenciesForDoughnutCanvasLabels = [];
            this.currenciesForDoughnutCanvas = [];

            if (this.doughnutChart !== undefined) {
                // Make sure the doughnut chart is destroyed if it already exists
                this.doughnutChart.destroy();
            }

            // Loop all balances of current wallet
            for (let y = 0; y < this.balances.length; y++) {
                let walletCurrency = this.balances[y].currency;
                let walletCurrencyAmount = this.balances[y].amount;
                // Loop all prices
                for (let i = 0; i < prices.length; i++) {
                    let price = prices[i];

                    let currencyFromApi = price.currencyFrom;
                    let currencyToApi = price.currencyTo;
                    let valueApi = price.value;
                    let currentCurrencyValue = new Smilo.FixedBigNumber(0, 0);
                    let found = false;
                    // If there is a value in the prices array that matches the from and to currency 1 to 1
                    if (currencyFromApi === walletCurrency && currencyToApi === this.pickedCurrency) {
                        currentCurrencyValue = walletCurrencyAmount.mul(valueApi);
                        found = true;
                    } else if (i === prices.length - 1) {
                        let alternatePrice = prices.find(price => price.currencyFrom === currencyToApi && price.currencyTo === this.pickedCurrency);

                        let alternatePriceValue = alternatePrice ? alternatePrice.value : undefined;
                        if (currencyToApi === this.pickedCurrency) {
                            alternatePriceValue = 1;
                            currentCurrencyValue = walletCurrencyAmount;
                            found = true;
                        } else if (alternatePriceValue === undefined) {
                            if (y === 0) {
                                const alert = this.alertCtrl.create({
                                    title: this.translations.get("wallet_overview.error"),
                                    subTitle: this.translations.get("wallet_overview.currency_value_zero"),
                                    buttons: ["OK"]
                                });
                                alert.present();
                            }
                        } else {
                            currentCurrencyValue = walletCurrencyAmount.mul(alternatePriceValue).mul(valueApi);
                            found = true;
                        }
                    }

                    if (found) {
                        totalValue = totalValue.add(currentCurrencyValue);

                        this.currenciesForDoughnutCanvasLabels.push(walletCurrency);
                        this.currenciesForDoughnutCanvas.push(Number(walletCurrencyAmount));

                        totalCurrencies = totalCurrencies.add(walletCurrencyAmount);
                        this.balances[y].valueAmount = currentCurrencyValue;//Number((currentCurrencyValue).toFixed(this.getFixedNumbers()));
                        break;
                    }
                }
            }

            // Loop the entire canvas data array
            for (let i = 0; i < this.currenciesForDoughnutCanvas.length; i++) {
                // If the data array is not zero
                if (this.currenciesForDoughnutCanvas[i] !== 0) {
                    this.currenciesForDoughnutCanvas[i] = Number(new Smilo.FixedBigNumber(100, 0).div(totalCurrencies).mul(this.currenciesForDoughnutCanvas[i]).toFixed(2));//Number(((100 / totalCurrencies) * this.currenciesForDoughnutCanvas[i]).toFixed(2));
                }
            }

            if (totalCurrencies.eq(0)) {
                let amountOfCurrencies = this.currenciesForDoughnutCanvas.length;
                this.currenciesForDoughnutCanvas = [];
                for (let i = 0; i < amountOfCurrencies; i++) {
                    this.currenciesForDoughnutCanvas.push(100 / amountOfCurrencies);
                }
            }

            this.totalCurrentCurrencyValue = totalValue.toFixed(this.getFixedNumbers());//Number(totalValue.toFixed(this.getFixedNumbers()));
            this.displayChart(animated); // Android Emulator rip
            if (this.doughnutChart !== undefined) {
                this.legendList = this.doughnutChart.generateLegend();
            }
        });
    }

    /**
     * Open the landing page
     */
    openLandingPage(): void {
        this.navCtrl.push(LandingPage);
    }

    /**
     * Whenever the current wallet is changed
     */
    onWalletChanged(): void {
        this.refreshWalletInfo();
    }

    /**
     * Presents the loading modal to the user.
     */
    openLoadingModal(): void {
        // Dismiss any other loading modals.
        this.dismissLoadingModal();

        this.loading = this.loadingCtrl.create({
            content: this.translations.get("wallet_overview.loading_wallet")
        });
        this.loadingModalOpen = true;
        this.loading.present();
    }

    dismissLoadingModal(): void {
        if (this.loading !== undefined && this.loadingModalOpen) {
            this.loadingModalOpen = false;
            this.loading.dismiss();
        }
    }

    refreshWalletInfo(silent: boolean = false) {
        if (!silent)
            this.openLoadingModal();

        let promiseBalance = this.getWalletBalance(this.currentWallet.publicKey, !silent);
        let promiseTransaction = this.getTransactionHistory(this.currentWallet.publicKey);

        Promise.all([
            promiseBalance,
            promiseTransaction
        ]).catch(
            (error) => {
                console.error(error);
                // Something went wrong!
                if (this.initialized && !silent) {
                    // Failed to update wallet info. Show an error message to the user.
                    const confirm = this.alertCtrl.create({
                        title: this.translations.get("wallet_overview.error"),
                        message: this.translations.get("wallet_overview.error_retrieving_data"),
                        buttons: [
                            {
                                text: this.translations.get("wallet_overview.click_retry"),
                                handler: () => {
                                    this.refreshWalletInfo();
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            }
        ).then(
            () => {
                // Dismiss loading modal whether it failed or succeeded.
                this.dismissLoadingModal();
            }
        )
    }

    /**
     * Show the distribution chart. False when chart could not be drawn
     */
    displayChart(animated: boolean = true): void {
        if (this.currenciesForDoughnutCanvas !== undefined &&
            this.currenciesForDoughnutCanvasLabels !== undefined &&
            this.doughnutCanvas !== undefined) {
            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                type: "doughnut",
                data: {
                    datasets: [{
                        data: this.currenciesForDoughnutCanvas,
                        backgroundColor: [
                            "#064C70",
                            "#1B79A9",
                            "#d0ff00",
                            "#9aedbf",
                            "#99cc66",
                            "#9966cc",
                            "#ff6666",
                            "#800000",
                            "#993366",
                            "#40e0d0"
                        ]
                    }],
                    labels: this.currenciesForDoughnutCanvasLabels
                },
                options: {
                    animation: {
                        duration: animated ? 500 : 0
                    },
                    legend: {
                        display: false
                    },
                    legendCallback: (chart) => {
                        let text = [];
                        for (let i = 0; i < chart.data.datasets[0].data.length; i++) {
                            text.push({
                                backgroundColor: chart.data.datasets[0].backgroundColor[i],
                                label: chart.data.labels[i],
                                data: chart.data.datasets[0].data[i]
                            });
                        }
                        return text;
                    },
                    title: {
                        display: false
                    }
                }
            });
        }
    }
}
