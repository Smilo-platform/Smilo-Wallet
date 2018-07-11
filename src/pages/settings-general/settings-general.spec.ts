import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsGeneralPage } from "./settings-general";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { SettingsService } from "../../services/settings-service/settings-service";
import { MockSettingService } from "../../../test-config/mocks/MockSettingsService";
import { ComponentsModule } from "../../components/components.module";
import 'rxjs/add/observable/of';
import { Observable } from "rxjs/Observable";

describe("SettingsGeneralPage", () => {
  let comp: SettingsGeneralPage;
  let fixture: ComponentFixture<SettingsGeneralPage>;
  let settingsService: MockSettingService;

  beforeEach(async(() => {
    settingsService = new MockSettingService();

    TestBed.configureTestingModule({
      declarations: [SettingsGeneralPage],
      imports: [
        IonicModule.forRoot(SettingsGeneralPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        SettingsService,
        TranslateService,
        { provide: NavController, useClass: MockNavController },
        { provide: SettingsService, useValue: settingsService },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGeneralPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())

  it("should initialize correctly", () => {
    expect(comp.nightModeStatus).toBe(false);
    expect(comp.activeLanguage).toBeUndefined();
    expect(comp.selectedTheme).toBeUndefined();
  });

  it("should change languages and set nightmode switch appropriately", (done) => {
    let themeSpy = spyOn(settingsService, "getActiveTheme").and.returnValue(Observable.of("dark-theme"));
    comp.nightModeStatus = false;
    comp.selectedTheme = "dark-theme";
    comp.ionViewDidLoad().then(data => {
      expect(comp.activeLanguage).toBe("en");
      expect(comp.nightModeStatus).toBeTruthy();

      themeSpy.and.returnValue(Observable.of("light-theme"));
      
      spyOn(settingsService, "getLanguageSettings").and.returnValue(Promise.resolve("nl"));

      comp.ionViewDidLoad().then(data => {
        expect(comp.activeLanguage).toBe("nl");
        expect(comp.nightModeStatus).toBeFalsy();

        done();
      });  
    });
  });

  it("should handle nightModeSwitch properly", () => {
    spyOn(settingsService, "setActiveTheme");
    spyOn(settingsService, "saveNightModeSettings");

    comp.selectedTheme = "dark-theme";
    comp.nightModeSwitch();
    expect(settingsService.setActiveTheme).toHaveBeenCalledWith('light-theme');
    // It's changed to light-theme in actual implementation due to a sub on the theme
    expect(settingsService.saveNightModeSettings).toHaveBeenCalledWith('dark-theme');

    comp.selectedTheme = "light-theme";
    comp.nightModeSwitch();
    expect(settingsService.setActiveTheme).toHaveBeenCalledWith('dark-theme');
    // It's changed to dark-theme in actual implementation due to a sub on the theme
    expect(settingsService.saveNightModeSettings).toHaveBeenCalledWith('light-theme');
  });

  it("should call the translate module properly on language change", () => {
    spyOn(comp.translate, "use");
    spyOn(settingsService, "saveLanguageSettings");

    comp.changeLanguage("en");

    expect(comp.translate.use).toHaveBeenCalledWith("en");
    expect(settingsService.saveLanguageSettings).toHaveBeenCalledWith("en");
  });
});