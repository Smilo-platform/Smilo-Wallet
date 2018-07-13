import { TranslateService, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler, TranslationChangeEvent, LangChangeEvent, DefaultLangChangeEvent } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { TranslateStore } from "@ngx-translate/core/src/translate.store";

export class MockTranslateService extends TranslateService {
    constructor() {
        super(null, null, null, null, null, true, true);
    }

    store: TranslateStore;
    currentLoader: TranslateLoader;
    compiler: TranslateCompiler;
    parser: TranslateParser;
    missingTranslationHandler: MissingTranslationHandler;
    onTranslationChange: any;
    onLangChange: any;
    onDefaultLangChange: any;
    defaultLang: string;
    currentLang: string;
    langs: string[];
    translations: any;
    setDefaultLang(lang: string): void {
        
    }
    getDefaultLang(): string {
        return "";
    }
    use(lang: string): Observable<any> {
        return Observable.of("");
    }
    getTranslation(lang: string): Observable<any> {
        return Observable.of("");
    }
    setTranslation(lang: string, translations: Object, shouldMerge?: boolean): void {
        
    }
    getLangs(): string[] {
        return [];
    }
    addLangs(langs: string[]): void {
        
    }
    getParsedResult(translations: any, key: any, interpolateParams?: Object) {
        
    }
    stream(key: string | string[], interpolateParams?: Object): Observable<any> {
        return Observable.of("");
    }
    instant(key: string | string[], interpolateParams?: Object) {
        
    }
    set(key: string, value: string, lang?: string): void {
        
    }
    reloadLang(lang: string): Observable<any> {
        return Observable.of("");
    }
    resetLang(lang: string): void {
        
    }
    getBrowserLang(): string {
        return "";
    }
    getBrowserCultureLang(): string {
        return "";
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