import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

export declare type ThemeType = "dark-theme" | "light-theme"; 
export declare type LanguageType = "en" | "nl"; 

export interface ISettingsService {
    setActiveTheme(val): void

    getActiveTheme(): Observable<string> 
    
    saveNightModeSettings(theme: ThemeType): Promise<void>

    saveLanguageSettings(language: LanguageType): Promise<void> 

    getNightModeSettings(): Promise<void>

    getLanguageSettings(): Promise<void>
}

@Injectable()
export class SettingsService {
    readonly theme: BehaviorSubject<string>;

    constructor(private storage: Storage) {
        this.theme = new BehaviorSubject('light-theme');
    }
    
    setActiveTheme(val): void {
        this.theme.next(val);
    }
 
    getActiveTheme(): Observable<string> {
        return this.theme.asObservable();
    }

    saveNightModeSettings(theme: ThemeType): Promise<any> {
        return this.storage.set("night_mode", theme);
    }

    saveLanguageSettings(language: LanguageType): Promise<any> {
        return this.storage.set("language", language);
    }

    getNightModeSettings(): Promise<string> {
        return this.storage.get("night_mode");
    }

    getLanguageSettings(): Promise<string> {
        return this.storage.get("language");
    }

}