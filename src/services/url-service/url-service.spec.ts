import { UrlService } from "./url-service";

describe("UrlService", () => {
    let urlService: UrlService;

    beforeEach(() => {
        urlService = new UrlService();
    });

    it("should initialize correctly", () => {
        expect(urlService.developmentBaseUrl).toBe("http://api.smilo.network:8080");
        expect(urlService.productionBaseUrl).toBe("http://api.smilo.network:8080");
    });

    it("should return the development url when devmode is on", () => {
        jasmine.createSpy('isDevMode').and.returnValue(true);

        expect(urlService.getBaseUrl()).toBe("http://api.smilo.network:8080");
    });

    it("should return the productionbase url when devmode is off", () => {
        jasmine.createSpy('isDevMode').and.returnValue(false);

        expect(urlService.getBaseUrl()).toBe("http://api.smilo.network:8080");
    });

});