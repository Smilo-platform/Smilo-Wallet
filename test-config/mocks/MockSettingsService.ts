import { ISettingsService } from "../../src/services/settings-service/settings-service";
import { Observable } from "rxjs/Observable";

export class MockSettingsService implements ISettingsService {
    getFundsSwitchSettings(): Promise<any> {
        return Promise.resolve();
    }
    getFundsSwitchStatus(): Observable<boolean> {
        return Observable.of(true);
    }
    setFundsSwitchStatus(val: any): void {
       
    }
    setActiveTheme(val: any): void {

    }
    getActiveTheme(): Observable<string> {
        return Observable.of("light-theme");
    }
    saveNightModeSettings(theme: "dark-theme" | "light-theme"): Promise<void> {
        return Promise.resolve();
    }
    
    saveLanguageSettings(language: "en" | "nl"): Promise<void> {
        return Promise.resolve();
    }

    getNightModeSettings(): Promise<void> {
        return Promise.resolve();
    }

    getLanguageSettings(): Promise<void> {
        return Promise.resolve();
    }
}