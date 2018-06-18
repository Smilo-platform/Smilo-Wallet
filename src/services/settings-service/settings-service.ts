import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

export declare type ThemeType = "dark-theme" | "light-theme"; 
export declare type LanguageType = "Engels" | "Nederlands"; 

export interface ISettingsService {
    saveNightModeSettings(theme: ThemeType): Promise<void>

    saveLanguageSettings(language: LanguageType): Promise<void> 

    getNightModeSettings(): Promise<void>

    getLanguageSettings(): Promise<void>
}

@Injectable()
export class SettingsService {
    constructor(private storage: Storage) {

    }

    saveNightModeSettings(theme: ThemeType): Promise<void> {
        return this.storage.set("night_mode", JSON.parse(JSON.stringify(theme)));
    }

    saveLanguageSettings(language: LanguageType): Promise<void> {
        return this.storage.set("language", JSON.parse(JSON.stringify(language)));
    }

    getNightModeSettings(): Promise<void> {
        return this.storage.get("night_mode");
    }

    getLanguageSettings(): Promise<void> {
        return this.storage.get("language");
    }

}