import { ISettingsService } from "../../src/services/settings-service/settings-service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs";

export class MockSettingService implements ISettingsService {
    setActiveTheme(val: any): void {

    }
    getActiveTheme(): Observable<string> {
        return Observable.of();
    }
    saveNightModeSettings(theme: "dark-theme" | "light-theme"): Promise<void> {
        return Promise.resolve();
    }
    
    saveLanguageSettings(language: "Engels" | "Nederlands"): Promise<void> {
        return Promise.resolve();
    }

    getNightModeSettings(): Promise<void> {
        return Promise.resolve();
    }

    getLanguageSettings(): Promise<void> {
        return Promise.resolve();
    }
}