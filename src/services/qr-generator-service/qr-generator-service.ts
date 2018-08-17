import { Injectable } from "@angular/core";
import { IPaymentRequest } from "../../models/IPaymentRequest";

declare const QRCode: any;

export interface IQRGeneratorService {
    generate(content: IPaymentRequest, element: HTMLElement, dimensions?: [number, number]): void;
}

@Injectable()
export class QRGeneratorService implements IQRGeneratorService {
    generate(content: IPaymentRequest, element: HTMLElement, dimensions: [number, number] = [256, 256]): void {
        new QRCode(content, {
            width: dimensions[0],
            height: dimensions[1]
        });
    }
}