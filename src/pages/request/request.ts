import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { IWallet } from "../../models/IWallet";
import { IBalance } from "../../models/IBalance";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";
import { QRGeneratorService } from "../../services/qr-generator-service/qr-generator-service";

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
    amount: FixedBigNumber;

    constructor(private navParams: NavParams,
                private qrGeneratorService: QRGeneratorService) { }

    ionViewDidLoad(): void {
        this.fromWallet = this.navParams.get("currentWallet");
        this.balances = this.navParams.get("currentWalletBalance");
        this.chosenCurrency = this.balances[0].currency;
    }

    generateQRCode(): void {
        console.log("Generate QR Code!");
        let paymentRequest: IPaymentRequest = {receiveAddress: this.fromWallet.publicKey,
                                               amount: this.amount, 
                                               assetId: "000x00123"};
        console.log(document.getElementById("qr-code-field"));
        this.qrGeneratorService.generate(paymentRequest, document.getElementById("qr-code-field"));
    }
}
