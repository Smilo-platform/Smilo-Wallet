import { TranslateService } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { BulkTranslateService } from "./bulk-translate-service";
import { Observable } from "rxjs/Observable";

describe("BulkTranslateService", () => {
    let translateService: TranslateService;
    let bulkTranslatorService: BulkTranslateService;
    
    beforeEach(() => {
        translateService = new MockTranslateService();
        bulkTranslatorService = new BulkTranslateService(translateService);
    });

    it("should return translations to specific keys with their values", (done) => {
        let mappedTranslations = {
            "translate.key1": "translateValue1",
            "translate.key2": "translateValue2",
            "translate.key3": "translateValue3"
        }
        
        spyOn(translateService, "get").and.returnValue(Observable.of(mappedTranslations));
        bulkTranslatorService.getTranslations([]).then(data => {
            expect(data.get("translate.key1")).toEqual("translateValue1");
            expect(data.get("translate.key2")).toEqual("translateValue2");
            expect(data.get("translate.key3")).toEqual("translateValue3");
            done();
        });
    })
});