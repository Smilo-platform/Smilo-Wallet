import { SettingsService } from "./settings-service";
import { MockStorage } from "../../../test-config/mocks/MockStorage";

describe("SettingsService", () => {
    let settingsService: SettingsService;
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
        settingsService = new SettingsService(storage);
    });

    it("should initialize correctly", () => {
        expect(settingsService.theme.value).toBe("light-theme");
    });

    it("should set theme to dark when changing theme", () => {
        settingsService.setActiveTheme("dark-theme");
        expect(settingsService.theme.value).toBe("dark-theme");
    });

    it("should return dark theme when setting theme to dark with the subscribe function", (done) => {
        settingsService.theme.next("light-theme");
        settingsService.setActiveTheme("dark-theme");
        settingsService.getActiveTheme().subscribe(data => {
            expect(data).toBe("dark-theme");
            done();
        });
    });

    it("should call the set on the storage with the right arguments (light-theme and dark-theme)", (done) => {
        spyOn(storage, "set").and.callThrough();
        spyOn(settingsService, "saveNightModeSettings").and.callThrough();
        
        let lightTheme = settingsService.saveNightModeSettings("light-theme").then(data => {
            expect(storage.set).toHaveBeenCalledWith("night_mode", "light-theme");
        });

        let darkTheme = settingsService.saveNightModeSettings("dark-theme").then(data => {
            expect(storage.set).toHaveBeenCalledWith("night_mode", "dark-theme");
        });

        Promise.all([lightTheme, darkTheme]).then(data => {
            done();
        })
    });

    it("should call the set on the storage with the right arguments (en and nl)", (done) => {
        spyOn(storage, "set").and.callThrough();
        spyOn(settingsService, "saveLanguageSettings").and.callThrough();
        
        let lightTheme = settingsService.saveLanguageSettings("en").then(data => {
            expect(storage.set).toHaveBeenCalledWith("language", "en");
        });

        let darkTheme = settingsService.saveLanguageSettings("nl").then(data => {
            expect(storage.set).toHaveBeenCalledWith("language", "nl");
        });

        Promise.all([lightTheme, darkTheme]).then(data => {
            done();
        })
    });

    it("should call get on the storage with argument night_mode", (done) => {
        spyOn(storage, "get").and.callThrough();

        settingsService.getNightModeSettings().then(data => {
            expect(storage.get).toHaveBeenCalledWith("night_mode");
            done();
        });
    });

    it("should call get on the storage with argument language", (done) => {
        spyOn(storage, "get").and.callThrough();

        settingsService.getLanguageSettings().then(data => {
            expect(storage.get).toHaveBeenCalledWith("language");
            done();
        });
    });

});