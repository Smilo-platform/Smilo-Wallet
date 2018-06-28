import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export interface IBulkTranslateService {
    
}

@Injectable()
export class BulkTranslateService implements IBulkTranslateService {

    constructor(private translateService: TranslateService) {}

    getTranslations(keys: string[]): Promise<Map<string, string>> {
        return this.translateService.get(keys).toPromise().then(data => {
            let translations: Map<string, string> = new Map<string, string>();
            Object.keys(data).forEach((key) => {
                let value = data[key];
                translations.set(key, value);
            });
            return translations;
        });
    }
}