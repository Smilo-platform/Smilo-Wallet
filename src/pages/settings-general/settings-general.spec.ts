import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsGeneralPage } from "./settings-general";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { SettingsService } from "../../services/settings-service/settings-service";
import { MockSettingService } from "../../../test-config/mocks/MockSettingsService";

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
        })
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
});