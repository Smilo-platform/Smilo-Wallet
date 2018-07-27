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

    getFundsSwitchSettings(): Promise<any>

    getFundsSwitchStatus(): Observable<boolean>

    setFundsSwitchStatus(val): void
}

@Injectable()
export class SettingsService {
    readonly theme: BehaviorSubject<ThemeType>;
    readonly fundsSwitch: BehaviorSubject<boolean>;

    constructor(private storage: Storage) {
        this.theme = new BehaviorSubject(<ThemeType>'light-theme');
        this.fundsSwitch = new BehaviorSubject(true);
    }
    
    setActiveTheme(val): void {
        this.theme.next(val);
    }
 
    getActiveTheme(): Observable<ThemeType> {
        return this.theme.asObservable();
    }

    setFundsSwitchStatus(val): void {
        this.fundsSwitch.next(val);
        this.saveFundsSwitchSettings(val);
    }

    getFundsSwitchStatus(): Observable<boolean> {
        return this.fundsSwitch.asObservable();
    }

    saveNightModeSettings(theme: ThemeType): Promise<any> {
        return this.storage.set("night_mode", theme);
    }

    saveLanguageSettings(language: LanguageType): Promise<any> {
        return this.storage.set("language", language);
    }

    private saveFundsSwitchSettings(status: boolean): Promise<any> {
        return this.storage.set("fundsswitch", status);
    }

    getNightModeSettings(): Promise<string> {
        return this.storage.get("night_mode");
    }

    getLanguageSettings(): Promise<string> {
        return this.storage.get("language");
    }

    getFundsSwitchSettings(): Promise<any> {
        return this.storage.get("fundsswitch");
    }

}