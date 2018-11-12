import { Component, NgZone } from "@angular/core";
import { IonicPage, NavParams, ToastController, Platform } from "ionic-angular";
import { IBalance } from "../../models/IBalance";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { TranslateService } from "@ngx-translate/core";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { QRScanner } from "@ionic-native/qr-scanner";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { Subscription } from "rxjs";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

@IonicPage()
@Component({
    selector: "page-transfer",
    templateUrl: "transfer.html",
})
export class TransferPage {
    /**
     * The wallet to transfer from
     */
    fromWallet: Smilo.IWallet;
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
    chosenCurrencyAmount: Smilo.FixedBigNumber;
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

    private addressHelper = new Smilo.AddressHelper();

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
            "transfer.scanner.failure",
            "transfer.scanner.scan_failure"
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
        if(!new Smilo.FixedBigNumber(this.amount, 0).isValid()) {
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

    transfer(): Promise<void> {
        this.resetTransferState();
        
        this.isTransferring = true;
        this.statusMessage = this.translations.get("transfer.signing_transaction");

        let transaction = this.createTransaction();
        
        return this.signTransaction(transaction).then(
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

    createTransaction(): Smilo.ITransaction {
        let transactionHelper = new Smilo.TransactionHelper();

        let transaction: Smilo.ITransaction = {
            timestamp: new Date().getTime(),
            inputAddress: this.fromWallet.publicKey,
            fee: new Smilo.FixedBigNumber(0, 0),
            assetId: "0x000000536d696c6f",
            inputAmount: new Smilo.FixedBigNumber(this.amount, 0), // TODO: base decimals on selected asset
            transactionOutputs: [
                { 
                    outputAddress: this.toPublicKey, 
                    outputAmount: new Smilo.FixedBigNumber(this.amount, 0) // TODO: base decimals on selected asset
                }
            ]
        };
        transaction.dataHash = transactionHelper.getDataHash(transaction);

        return transaction;
    }

    signTransaction(transaction: Smilo.ITransaction): Promise<void> {
        return this.transactionSignService.sign(
            this.fromWallet as Smilo.ILocalWallet,
            this.password,
            transaction
        );
    }

    isValidPaymentRequest(request: IPaymentRequest): boolean {
        return !!request.receiveAddress &&
               this.addressHelper.isValidAddress(request.receiveAddress).isValid &&
               !!request.amount && !!request.assetId;
    }

    showCamera() {
        this.hideUI();
        this.qrScanner.show();
        this.cameraIsShown = true;

        if(this.platform.is("android")) {
            this.unregisterBackButtonFunction = this.platform.registerBackButtonAction(() => {
                this.hideCamera();
            });
        }
    }

    hideCamera() {
        this.qrScanner.hide();
        this.qrScanner.destroy();

        this.showUI();
        this.cameraIsShown = false;

        if(this.unregisterBackButtonFunction && this.platform.is("android")) {
            this.unregisterBackButtonFunction();
            this.unregisterBackButtonFunction = null;
        }

        if(this.scanSubscription) {
            this.scanSubscription.unsubscribe();
        }
    }

    hideUI() {
        document.body.className = "camera-ready";

        // Safari does not update the screen correctly causing the camera
        // to still be obscured by a white background. This pointless rotation
        // tricks Safari into thinking a fullscreen refresh is required.
        setTimeout(() => {
            document.body.style.transform = "rotate(360deg)";
        }, 100);
    }

    showUI() {
        document.body.className = "";
        document.body.style.transform = "rotate(0deg)";
    }

    scanQRCode(): Promise<void> {
        // Make the screen camera ready
        return this.qrScanner.prepare().then(
            (status) => {
                if(status.authorized) {
                    return new Promise<void>((resolve) => {
                        this.scanSubscription = this.qrScanner.scan().subscribe(
                            (text) => {
                                // Browser platforms for some reason return an object and not the text...
                                text = (<any>text).result || text;
    
                                this.zone.run(
                                    () => {
                                        this.handleCameraScanResult(text);

                                        resolve();
                                    }
                                );
                            }
                        );
    
                        this.showCamera();
                    });
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
        let paymentRequest: IPaymentRequest;
        try {
            paymentRequest = JSON.parse(result);
        }
        catch(ex) {}

        if(paymentRequest) {
            if(this.isValidPaymentRequest(paymentRequest)) {
                // We found a valid QR code
                this.toPublicKey = paymentRequest.receiveAddress;
                this.amount = paymentRequest.amount;
                this.chosenCurrency = paymentRequest.assetId == "0x000000536d696c6f" ? "XSM" : "XSP";

                this.onAmountChanged();
            }
            else {
                // Invalid payment request.
                this.toastController.create({
                    message: this.translations.get("transfer.scanner.scan_failure"),
                    duration: 2000,
                    position: "top"
                }).present();
            }
        }
        else {
            // We did not find valid JSON. We'll continue scanning.
            this.toastController.create({
                message: this.translations.get("transfer.scanner.scan_failure"),
                duration: 2000,
                position: "top"
            }).present();
        }

        this.hideCamera();
    }
}