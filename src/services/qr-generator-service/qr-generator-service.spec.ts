import { QRGeneratorService } from "./qr-generator-service";

describe("QRGeneratorService", () => {
    let service: QRGeneratorService;

    beforeEach(() => {
        service = new QRGeneratorService();
    });

    it("should fill the given HTML element", () => {
        let element = document.createElement("div");

        service.generate("hello", element);

        expect(element.getElementsByTagName("canvas").length).toBe(1);
        expect(element.getElementsByTagName("img").length).toBe(1);
    });

    it("should fill the given HTML element with the correct dimensions", () => {
        let element = document.createElement("div");

        service.generate("hello", element, [512, 256]);

        let canvas: HTMLCanvasElement = element.getElementsByTagName("canvas")[0];

        expect(canvas.width).toBe(512);
        expect(canvas.height).toBe(256);
    });
});