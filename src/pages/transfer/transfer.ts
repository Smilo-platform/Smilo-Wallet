import { Component, NgZone } from "@angular/core";
import { IonicPage, NavParams, ToastController, Platform } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { ITransaction } from "../../models/ITransaction";
import { TransactionHelper } from "../../core/transactions/TransactionHelper";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { TranslateService } from "@ngx-translate/core";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { AssetService } from "../../services/asset-service/asset-service";
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";
import { QRScanner } from "@ionic-native/qr-scanner";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { AddressHelper } from "../../core/address/AddressHelper";
import { Subscription } from "rxjs";

@IonicPage()
@Component({
    selector: "page-transfer",
    templateUrl: "transfer.html",
})
export class TransferPage {
    /**
     * The wallet to transfer from
     */
    fromWallet: IWallet;
    /**
     * The public key (address) to transfer to
     */
    toPublicKey: string;
    /**
     * The balances of the current wallet
     */
    balances: IBalance[];
    /**
     * The currency to send
     */
    chosenCurrency: string;
    /**
     * The amount of the chosen currency
     */
    chosenCurrencyAmount: FixedBigNumber;
    /**
     * The amount of the currency to send
     */
    amount: string;
    /**
     * The error message to show if there is any
     */
    errorMessage: string;
    /**
     * The status message to show if there is any
     */
    statusMessage: string;
    /**
     * Check for enough funds on the current wallet and currency
     */
    enoughFunds: boolean;
    /**
     * The password for signing the transaction
     */
    password: string;
    /**
     * True if a transfer is currently in process.
     */
    isTransferring: boolean;
    /**
   * List of translations set programmatically
   */
    translations: Map<string, string> = new Map<string, string>();

    /**
     * True if the camera is currently active.
     */
    cameraIsShown: boolean = false;

    /**
     * Function to call when unregistering the back button handler.
     */
    unregisterBackButtonFunction: Function;

    /**
     * The subscription used to get scan responses.
     */
    scanSubscription: Subscription;

    private addressHelper = new AddressHelper();

    constructor(private navParams: NavParams,
        private transactionSignService: TransactionSignService,
        private transferTransactionService: TransferTransactionService,
        private translateService: TranslateService,
        private bulkTranslateService: BulkTranslateService,
        private qrScanner: QRScanner,
        private zone: NgZone,
        private toastController: ToastController,
        private platform: Platform) { }

    ionViewDidLoad(): void {
        this.getAndSubscribeToTranslations();

        this.isTransferring = false;
        this.fromWallet = this.navParams.get("currentWallet");
        this.balances = this.navParams.get("currentWalletBalance");
        this.chosenCurrency = this.balances[0].currency;
        this.chosenCurrencyAmount = this.balances[0].amount;
    }

    ionViewDidLeave(): void {
        this.hideCamera();
    }

    getAndSubscribeToTranslations(): void {
        this.translateService.onLangChange.subscribe(data => {
            this.retrieveTranslations();
        });
        this.retrieveTranslations();
    }

    /**
   * Gets the translations to set programmatically
   */
    retrieveTranslations(): Promise<Map<string, string>> {
        return this.bulkTranslateService.getTranslations([
            "transfer.empty_public_key",
            "transfer.empty_amount",
            "transfer.not_enough_funds",
            "transfer.own_wallet",
            "transfer.empty_password_field",
            "transfer.signing_transaction",
            "transfer.signing_success",
            "transfer.signing_failed",
            "transfer.sent_success",
            "transfer.sent_failed",
            "transfer.scanner.access_denied",
            "transfer.scanner.failure"
        ]).then(data => {
            this.translations = data;
            return data;
        });
    }

    setChosenCurrencyAmount(): boolean {
        for (let currency of this.balances) {
            if (currency.currency === this.chosenCurrency) {
                this.chosenCurrencyAmount = currency.amount;
                this.onAmountChanged();
                return true;
            }
        }
        return false;
    }

    canTransfer(): boolean {
        // Check if public key is set
        if (!this.toPublicKey || this.toPublicKey === "") {
            return false;
        }

        // Check if amount is set
        if (!this.amount || this.amount.toString() === "") {
            return false;
        } 

        // Check if amount is a valid number
        // TODO: make generic e.g. take selected asset into account
        if(!new FixedBigNumber(this.amount, 0).isValid()) {
            return false;
        }

        // Check if user has enough funds
        if (!this.enoughFunds) {
            return false;
        } 

        // Make sure we are not sending to our own wallet
        if (this.toPublicKey === this.fromWallet.publicKey) {
            return false;
        } 

        // Make sure password has been entered
        if (this.password === undefined || this.password === "") {
            return false;
        } 
        
        return true;
    }

    resetTransferState() {
        this.isTransferring = false;
        this.errorMessage = "";
        this.statusMessage = "";
    }

    onAmountChanged(): void {
        this.resetTransferState();

        if (this.amount === undefined || this.amount.toString() === "") {
            this.enoughFunds = undefined;
        } 
        else if (this.chosenCurrencyAmount.gte(this.amount)) {
            this.enoughFunds = true;
        } 
        else {
            this.enoughFunds = false;
        }
    }

    transfer(): void {
        this.resetTransferState();
        
        this.isTransferring = true;
        this.statusMessage = this.translations.get("transfer.signing_transaction");

        let transaction = this.createTransaction();
        
        this.signTransaction(transaction).then(
            () => this.transferTransactionService.sendTransaction(transaction)
        ).then(
            () => {
                // Transaction send!
                this.translateService.get("transfer.sent_success", { amount: this.amount, chosenCurrency: this.chosenCurrency, toPublicKey: this.toPublicKey }).subscribe(
                    (translation) => {
                        // Status message should notify user of success
                        this.statusMessage = translation

                        // Update balance locally
                        let index = this.balances.indexOf(this.balances.find(x => x.currency === this.chosenCurrency));
                        this.balances[index].amount = this.balances[index].amount.sub(this.amount);
                        this.chosenCurrencyAmount = this.balances[index].amount;

                        // Reset input forms
                        this.toPublicKey = "";
                        this.amount = null;
                        this.enoughFunds = undefined;
                        this.password = "";
                    }
                );
            },
            (error) => {
                // Something went wrong!
                console.error(error);
                this.errorMessage = this.translations.get("transfer.signing_failed");
                this.statusMessage = "";
            }
        ).then(
            () => {
                // We are no longer transferring
                this.isTransferring = false;
            }
        );
    }

    createTransaction(): ITransaction {
        let transactionHelper = new TransactionHelper();

        let transaction: ITransaction = {
            timestamp: new Date().getTime(),
            inputAddress: this.fromWallet.publicKey,
            fee: new FixedBigNumber(0, 0),
            assetId: "000x00123",
            inputAmount: new FixedBigNumber(this.amount, 0), // TODO: base decimals on selected asset
            transactionOutputs: [
                { 
                    outputAddress: this.toPublicKey, 
                    outputAmount: new FixedBigNumber(this.amount, 0) // TODO: base decimals on selected asset
                }
            ]
        };
        transaction.dataHash = transactionHelper.getDataHash(transaction);

        return transaction;
    }

    signTransaction(transaction: ITransaction): Promise<void> {
        return this.transactionSignService.sign(
            this.fromWallet as ILocalWallet,
            this.password,
            transaction
        );
    }

    isValidPaymentRequest(request: IPaymentRequest) {
        return request.receiveAddress &&
               this.addressHelper.isValidAddress(request.receiveAddress).isValid &&
               request.amount && request.assetId;
    }

    showCamera() {
        this.hideUI();
        this.qrScanner.show();
        this.cameraIsShown = true;

        this.unregisterBackButtonFunction = this.platform.registerBackButtonAction(() => {
            this.hideCamera();
        });
    }

    hideCamera() {
        this.qrScanner.hide();
        this.qrScanner.destroy();

        this.showUI();
        this.cameraIsShown = false;

        if(this.unregisterBackButtonFunction) {
            this.unregisterBackButtonFunction();
            this.unregisterBackButtonFunction = null;
        }

        if(this.scanSubscription) {
            this.scanSubscription.unsubscribe();
        }
    }

    hideUI() {
        document.getElementsByTagName("body")[0].className = "camera-ready";
    }

    showUI() {
        document.getElementsByTagName("body")[0].className = "";
    }

    scanQRCode() {
        // Make the screen camera ready
        this.qrScanner.prepare().then(
            (status) => {
                console.log(status);
                if(status.authorized) {
                    this.scanSubscription = this.qrScanner.scan().subscribe(
                        (text) => {
                            // Browser platforms for some reason return an object and not the text...
                            text = (<any>text).result || text;

                            this.zone.run(() => this.handleCameraScanResult(text));
                        }
                    );

                    this.showCamera();
                }
                else if(status.denied) {
                    // User denied permission.
                    this.toastController.create({
                        message: this.translations.get("transfer.scanner.access_denied"),
                        duration: 2000,
                        position: "top"
                    }).present();
                }
                else {
                    // Permission was denied but not permanently
                    this.toastController.create({
                        message: this.translations.get("transfer.scanner.access_denied"),
                        duration: 2000,
                        position: "top"
                    }).present();
                }
            },
            (error) => {
                if(error.code == 1) {
                    // Camera access denied
                    this.toastController.create({
                        message: this.translations.get("transfer.scanner.access_denied"),
                        duration: 2000,
                        position: "top"
                    }).present();
                }
                else {
                    // Something went wrong...
                    this.toastController.create({
                        message: this.translations.get("transfer.scanner.failure"),
                        duration: 2000,
                        position: "top"
                    }).present();
                }
            }
        );
    }

    handleCameraScanResult(result: string) {
        // Try and parse the text to JSON
        let obj: IPaymentRequest;
        try {
            obj = JSON.parse(result);
        }
        catch(ex) {}

        if(obj) {
            if(this.isValidPaymentRequest(obj)) {
                // We found a valid QR code
                this.hideCamera();

                this.toPublicKey = obj.receiveAddress;
                this.amount = obj.amount;
                this.chosenCurrency = obj.assetId == "000x00123" ? "XSM" : "XSP";

                this.onAmountChanged();
            }
            else {
                // Invalid payment request.
                this.toastController.create({
                    message: "Invalid payment request format",
                    duration: 2000,
                    position: "top"
                }).present();
            }
        }
        else {
            // We did not find valid JSON. We'll continue scanning.
            this.toastController.create({
                message: "Could not parse JSON",
                duration: 2000,
                position: "top"
            }).present();
        }
    }
}