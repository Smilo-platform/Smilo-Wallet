import { UrlService } from "./url-service";
import { enableProdMode } from "@angular/core";

describe("UrlService", () => {
    let urlService: UrlService;

    beforeEach(() => {
        urlService = new UrlService();
    });

    it("should initialize correctly", () => {
        expect(urlService.developmentBaseUrl).toBe("http://localhost:8090");
        expect(urlService.productionBaseUrl).toBe("http://api.smilo.network:8080");
    });

    it("should return the development url when devmode is on", () => {
        spyOn(urlService, "isDevelopment").and.returnValue(true);

        expect(urlService.getBaseUrl()).toBe("http://localhost:8090");
    });

    it("should return the productionbase url when devmode is off", () => {
        spyOn(urlService, "isDevelopment").and.returnValue(false);

        expect(urlService.getBaseUrl()).toBe("http://api.smilo.network:8080");
    });

    it("should return true when checking for devmode", () => {
        expect(urlService.isDevelopment()).toBeTruthy();
    });

});