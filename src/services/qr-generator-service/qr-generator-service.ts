import { Injectable } from "@angular/core";
import { IPaymentRequest } from "../../models/IPaymentRequest";

declare const QRCode: any;

export interface IQRGeneratorService {
    generate(content: string, element: HTMLElement, dimensions?: [number, number]): void;
}

@Injectable()
export class QRGeneratorService implements IQRGeneratorService {
    generate(content: string, element: HTMLElement, dimensions: [number, number] = [256, 256]): void {
        let qrcode = new QRCode(element);
        qrcode.makeCode(content);
    }
}