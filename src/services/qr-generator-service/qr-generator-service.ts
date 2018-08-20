import { Injectable } from "@angular/core";

declare const QRCode: any;

export interface IQRGeneratorService {
    generate(content: string, element: HTMLElement, dimensions?: [number, number]): void;
}

@Injectable()
export class QRGeneratorService implements IQRGeneratorService {
    generate(content: string, element: HTMLElement, dimensions: [number, number] = [256, 256]): void {
        let qrcode = new QRCode(element, {
            width: dimensions[0],
            height: dimensions[1]
        });
        qrcode.makeCode(content);
    }
}