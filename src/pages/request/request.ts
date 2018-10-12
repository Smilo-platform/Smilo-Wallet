import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController } from "ionic-angular";
import { IBalance } from "../../models/IBalance";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { QrCodePage } from "../qr-code-page/qr-code-page";
import { ThemeType, SettingsService } from "../../services/settings-service/settings-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

@IonicPage()
@Component({
    selector: "page-request",
    templateUrl: "request.html",
})
export class RequestPage {
    /**
     * The wallet to request from
     */
    fromWallet: Smilo.IWallet;
    /**
     * The public key of the from wallet
     */
    fromPublicKey: string;
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
    amount: string;
    selectedTheme: ThemeType;

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private settingsService: SettingsService) { }

    ionViewDidLoad(): void {
        this.fromWallet = this.navParams.get("currentWallet");
        this.fromPublicKey = this.fromWallet.publicKey;
        this.balances = this.navParams.get("currentWalletBalance");
        this.chosenCurrency = this.balances[0].currency;

        this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
    }

    generateQRCode(): void {
        let paymentRequest: IPaymentRequest = {
            receiveAddress: this.fromWallet.publicKey,
            amount: this.amount, 
            assetId: "000x00123"
        };

        let modal = this.modalController.create(
            QrCodePage, 
            { 
                paymentRequest: paymentRequest
            }, 
            { 
                cssClass: this.selectedTheme
            }
        );

        modal.present();
    }

    canTransfer(): boolean {
        if(!this.fromWallet)
            return false;

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
        if (!new Smilo.FixedBigNumber(this.amount, 0).isValid()) {
            return false;
        }

        return true;
    }
}
