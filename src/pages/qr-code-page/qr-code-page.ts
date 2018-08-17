import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { QRGeneratorService } from "../../services/qr-generator-service/qr-generator-service";
import { IPaymentRequest } from "../../models/IPaymentRequest";

@IonicPage()
@Component({
  selector: "qr-code-page",
  templateUrl: "qr-code-page.html",
})
export class QrCodePage {
  paymentRequest: IPaymentRequest;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private qrGeneratorService: QRGeneratorService) { }

  ionViewDidLoad(): void {
    this.paymentRequest = this.navParams.get("paymentRequest");
    this.qrGeneratorService.generate(this.paymentRequest, document.getElementById("qr-code-field"));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
