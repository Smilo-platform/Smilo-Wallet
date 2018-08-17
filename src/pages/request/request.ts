import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";
import { QRGeneratorService } from "../../services/qr-generator-service/qr-generator-service";
import { QrCodePage } from "../qr-code-page/qr-code-page";
import { ThemeType, SettingsService } from "../../services/settings-service/settings-service";

@IonicPage()
@Component({
    selector: "page-request",
    templateUrl: "request.html",
})
export class RequestPage {
    /**
     * The wallet to request from
     */
    fromWallet: IWallet;
    /**
     * The balances of the current wallet
     */
    balances: IBalance[];
     /**
     * The currency to request
     */
    chosenCurrency: string;
    /**
     * The amount of the currency to request
     */
    amount: number;
    selectedTheme: ThemeType;

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private settingsService: SettingsService) { }

    ionViewDidLoad(): void {
        this.fromWallet = this.navParams.get("currentWallet");
        this.balances = this.navParams.get("currentWalletBalance");
        this.chosenCurrency = this.balances[0].currency;
    }

    ngOnInit(): void {
        this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
      }

    generateQRCode(): void {
        let paymentRequest: IPaymentRequest = {receiveAddress: this.fromWallet.publicKey,
                                               amount: new FixedBigNumber(this.amount, 0), 
                                               assetId: "000x00123"};
        let modal = this.modalController.create(QrCodePage, { paymentRequest: paymentRequest }, { cssClass: this.selectedTheme });
        modal.present();
    }

    canTransfer(): boolean {
        // Check if public key is set
        if (!this.fromWallet.publicKey || this.fromWallet.publicKey === "") {
            return false;
        }

        // Check if amount is set
        if (!this.amount || this.amount.toString() === "") {
            return false;
        } 

        // Check if amount is a valid number
        // TODO: make generic e.g. take selected asset into account
        if (!new FixedBigNumber(this.amount, 0).isValid()) {
            return false;
        }        
        return true;
    }
}
