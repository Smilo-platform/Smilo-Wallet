import { ISettingsService } from "../../src/services/settings-service/settings-service";

export class MockSettingService implements ISettingsService {
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