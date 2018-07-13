import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LandingPage } from "./landing";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { WalletPage } from "../wallet/wallet";
import { TranslateModule, TranslateService, TranslatePipe, TranslateLoader } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockTranslatePipe } from "../../../test-config/mocks/MockTranslatePipe";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { Observable } from "rxjs/Observable";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MockSplashScreen } from "../../../test-config/mocks/MockSplashScreen";
import { ComponentsModule } from "../../components/components.module";
import { WalletImportPassphrasePage } from "../wallet-import-passphrase/wallet-import-passphrase";
import { WalletImportPage } from "../wallet-import/wallet-import";
import { WalletNewPage } from "../wallet-new/wallet-new";
import { SettingsGeneralPage } from "../settings-general/settings-general";

describe("LandingPage", () => {
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  let navController: MockNavController;
  let splashScreen: SplashScreen;

  beforeEach(async(() => {
    navController = new MockNavController();
    splashScreen = new MockSplashScreen();

    TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [
        IonicModule.forRoot(LandingPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() },
        { provide: SplashScreen, useValue: splashScreen }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should hide the splashscreen correctly", () => {
    spyOn(window, "setTimeout").and.callFake(
      (callback, time) => {

        // just call callback immediately
        callback();
      }
    );

    spyOn(splashScreen, "hide");

    comp.ionViewDidEnter();

    expect(splashScreen.hide).toHaveBeenCalled();
  });

  it("should go to the new wallet page", () => {
    spyOn(navController, "push");

    comp.openNewWallet();

    expect(navController.push).toHaveBeenCalledWith(WalletNewPage, {NAVIGATION_ORIGIN: "landing"});
  });

  it("should go to the import wallet page", () => {
    spyOn(navController, "push");

    comp.openRestoreBackup();

    expect(navController.push).toHaveBeenCalledWith(WalletImportPage, {NAVIGATION_ORIGIN: "landing"});
  });

  it("should push the settingspage on the navcontroller", () => {
    spyOn(navController, "push");

    comp.openSettingsPage();

    expect(navController.push).toHaveBeenCalledWith(SettingsGeneralPage);
  });
});