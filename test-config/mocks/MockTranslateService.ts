import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

export class MockTranslateService extends TranslateService {
    constructor() {
        super(null, null, null, null, null);
    }

    get(key: any): any {
        return Observable.of(key);
    }
}