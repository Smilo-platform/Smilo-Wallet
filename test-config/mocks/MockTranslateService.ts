import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

export class MockTranslateService extends TranslateService {
    get(key: any): any {
        return Observable.of(key);
    }
}