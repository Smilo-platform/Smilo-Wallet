import { HttpLoaderFactory } from "./app.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

describe('App Module', () => {

    it("should return translatehttploader correctly", () => {
        let result = HttpLoaderFactory(null);
        expect(result).toEqual(new TranslateHttpLoader(null, "assets/i18n/"));
    });
});