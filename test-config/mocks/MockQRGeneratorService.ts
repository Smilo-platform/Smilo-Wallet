import { IQRGeneratorService } from "../../src/services/qr-generator-service/qr-generator-service";

export class MockQRGeneratorService implements IQRGeneratorService {
    generate(content: string, element: HTMLElement, dimensions?: [number, number]): void {
        // Do nothing
    }

}