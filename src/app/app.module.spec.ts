import { HttpLoaderFactory, AppModule } from "./app.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, Platform } from "ionic-angular";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../components/components.module";
import { SmiloWallet } from "./app.component";
import { MockAndroidPermissions } from "../../test-config/mocks/MockAndroidPermissions";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { MockWalletService } from "../../test-config/mocks/MockWalletService";
import { WalletService } from "../services/wallet-service/wallet-service";
import { MockHockeyApp } from "../../test-config/mocks/MockHockeyApp";
import { HockeyApp } from "ionic-hockeyapp";
import { MockSettingService } from "../../test-config/mocks/MockSettingsService";
import { SettingsService } from "../services/settings-service/settings-service";
import { MockStatusBar } from "../../test-config/mocks/MockStatusBar";
import { StatusBar } from "@ionic-native/status-bar";
import { MockPlatform } from "../../test-config/mocks/MockPlatform";
import { MockTranslateService } from "../../test-config/mocks/MockTranslateService";
import { LandingPage } from "../pages/landing/landing";
import { HomePage } from "../pages/home/home";
import { MockAssetService } from "../../test-config/mocks/MockAssetService";
import { AssetService } from "../services/asset-service/asset-service";

describe('SmiloWallet', () => {
    let comp: SmiloWallet;
    let fixture: ComponentFixture<SmiloWallet>;
    let androidPermissions: MockAndroidPermissions;
    let walletService: MockWalletService;
    let hockeyApp: MockHockeyApp;
    let settingsService: MockSettingService;
    let statusBar: MockStatusBar;
    let platform: MockPlatform;
    let translate: MockTranslateService;
    let assetService: MockAssetService;

    beforeEach(async(() => {
        androidPermissions = new MockAndroidPermissions();
        walletService = new MockWalletService();
        hockeyApp = new MockHockeyApp();
        settingsService = new MockSettingService();
        statusBar = new MockStatusBar();
        platform = new MockPlatform();
        translate = new MockTranslateService();
        assetService = new MockAssetService();

        TestBed.configureTestingModule({
            declarations: [SmiloWallet],
            imports: [
            IonicModule.forRoot(SmiloWallet),
            TranslateModule.forRoot({
                loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
            }),
                ComponentsModule
            ],
            providers: [
                { provide: AndroidPermissions, useValue: androidPermissions },
                { provide: WalletService, useValue: walletService },
                { provide: HockeyApp, useValue: hockeyApp },
                { provide: SettingsService, useValue: settingsService },
                { provide: StatusBar, useValue: statusBar },
                { provide: Platform, useValue: platform },
                { provide: TranslateService, useValue: translate },
                { provide: AssetService, useValue: assetService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmiloWallet);
        comp = fixture.componentInstance;
    });

    it("should create component", () => expect(comp).toBeDefined());

    it("should return translatehttploader correctly", () => {
        let result = HttpLoaderFactory(null);
        expect(result).toEqual(new TranslateHttpLoader(null, "assets/i18n/"));
    });

    it("should make a call to style the status bar light, prepare permissions, settings, translations, hockeyappintegration and firstpage", (done) => {
        spyOn(statusBar, "styleLightContent");
        spyOn(comp, "preparePermissions");
        spyOn(comp, "prepareSettings");
        spyOn(comp, "prepareHockeyAppIntegration");
        spyOn(comp, "prepareFirstPage");

        comp.ngOnInit().then(data => {
            expect(statusBar.styleLightContent).toHaveBeenCalled();
            expect(comp.preparePermissions).toHaveBeenCalled();
            expect(comp.prepareSettings).toHaveBeenCalled();
            expect(comp.prepareHockeyAppIntegration).toHaveBeenCalled();
            expect(comp.prepareFirstPage).toHaveBeenCalled();
            done();
        });
    });

    it("should prepare the permissions for android", () => {
        spyOn(platform, "is").and.callFake((arg) => {
            return arg === "android"
        });
        spyOn(androidPermissions, "requestPermissions");

        comp.preparePermissions();

        expect(androidPermissions.requestPermissions).toHaveBeenCalledWith([androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
    });

    it("should not request android permissions when not on android platform", () => {
        spyOn(platform, "is").and.returnValue(false);
        spyOn(androidPermissions, "requestPermissions");

        comp.preparePermissions();

        expect(androidPermissions.requestPermissions).not.toHaveBeenCalled();
    });

    it("should set the proper default language and theme", (done) => {
        spyOn(settingsService, "getActiveTheme").and.callThrough();
        spyOn(settingsService, "getLanguageSettings").and.callThrough();
        spyOn(settingsService, "setActiveTheme");
        spyOn(translate, "setDefaultLang");
        spyOn(translate, "use");

        comp.prepareSettings().then(data => {
            expect(settingsService.getActiveTheme).toHaveBeenCalled();
            expect(translate.setDefaultLang).toHaveBeenCalledWith("en");
            expect(translate.use).toHaveBeenCalledWith("en");
            expect(settingsService.setActiveTheme).toHaveBeenCalledWith("light-theme");
            done();
        });
    });

    it("should call hockey start with the right arguments and return a resolved promise", (done) => {
        spyOn(hockeyApp, "start").and.returnValue(Promise.resolve());

        comp.prepareHockeyAppIntegration().then(data => {
            expect(hockeyApp.start).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), true, true);
            done();
        });
    });

    it("should set rootpage to homepage because there is atleast 1 wallet", (done) => {
        comp.prepareFirstPage().then(data => {
            expect(comp.rootPage).toBe(HomePage);
            done();
        });
    });

    it("should set rootpage to landingpage because there are no wallets", (done) => {
        spyOn(walletService, "getAll").and.returnValue(Promise.resolve([]));

        comp.prepareFirstPage().then(data => {
            expect(comp.rootPage).toBe(LandingPage);
            done();
        });
    });

    it("should return a rejected promise and let rootpage be undefined", (done) => {
        spyOn(walletService, "getAll").and.returnValue(Promise.reject(""));

        comp.prepareFirstPage().then(data => {
            // Should not get here
            expect(true).toBeFalsy();
            done();
        }).catch(data => {
            expect(comp.rootPage).toBeUndefined();
            done();
        });
    });
});