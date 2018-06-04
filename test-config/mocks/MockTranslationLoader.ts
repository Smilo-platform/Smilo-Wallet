import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

export class MockTranslationLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of({});
    }
}