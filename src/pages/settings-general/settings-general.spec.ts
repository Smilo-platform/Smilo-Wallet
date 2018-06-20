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
  })

  it("should have undefined as saved language", (done) => {
    comp.settingsService.getLanguageSettings().then(data => {
      expect(data).toBeUndefined();
      done();
    })
  })

  it("should have undefined as saved theme", (done) => {
    comp.settingsService.getActiveTheme().subscribe(data => {
      expect(data).toBe("light-theme");
      done();
    })
  })

  it("should have en as default language after setting it in the translate module", () => {
    comp.translate.setDefaultLang("en")
    expect(comp.translate.getDefaultLang()).toBe("en");
  })
});