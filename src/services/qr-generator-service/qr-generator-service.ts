import { Injectable } from "@angular/core";

declare const QRCode: any;

export interface IQRGeneratorService {
    generate(content: string, element: string | HTMLElement, dimensions?: [number, number]): void;
}

@Injectable()
export class QRGeneratorService implements IQRGeneratorService {
    generate(content: string, element: string | HTMLElement, dimensions: [number, number] = [256, 256]): void {
        new QRCode(content, {
            width: dimensions[0],
            height: dimensions[1]
        });
    }
}