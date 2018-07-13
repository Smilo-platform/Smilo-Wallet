import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

export class MockTranslateService extends TranslateService {
    constructor() {
        super(null, null, null, null, null, true, true);
    }

    get(key: any): any {
        return Observable.of(key);
    }

    use(lang: string): Observable<any> {
        let changeEvent: LangChangeEvent = {lang: lang, translations: null}
        this.onLangChange.next(changeEvent);
        return Observable.of();
    }

    
}