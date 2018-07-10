import { HttpLoaderFactory, AppModule } from "./app.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "ionic-angular";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
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

describe('SmiloWallet', () => {
    let comp: SmiloWallet;
    let fixture: ComponentFixture<SmiloWallet>;
    let androidPermissions: MockAndroidPermissions;
    let walletService: MockWalletService;
    let hockeyApp: MockHockeyApp;
    let settingsService: MockSettingService;
    let statusBar: MockStatusBar;
    // let platform: MockPlatform;

    beforeEach(async(() => {
        androidPermissions = new MockAndroidPermissions();
        walletService = new MockWalletService();
        hockeyApp = new MockHockeyApp();
        settingsService = new MockSettingService();
        statusBar = new MockStatusBar();

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
                { provide: StatusBar, useValue: statusBar }
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

    it("", () => {
        spyOn(comp, "ngOnInit").and.callThrough();
        // spyOn(platform, "ready")

        comp.ngOnInit();
    });
});