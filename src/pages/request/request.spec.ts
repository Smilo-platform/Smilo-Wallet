import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RequestPage } from "./request";
import { IonicModule, NavParams} from "ionic-angular/index";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockModalController } from "../../../test-config/mocks/MockModalController";
import { MockSettingService } from "../../../test-config/mocks/MockSettingsService";
import { ModalController, NavController } from "ionic-angular";
import { SettingsService } from "../../services/settings-service/settings-service";
import { MockNavController } from "../../../test-config/mocks/MockNavController";

describe("RequestPage", () => {
  let comp: RequestPage;
  let fixture: ComponentFixture<RequestPage>;
  let navParams: MockNavParams;
  let navController: MockNavController;
  let modalController: MockModalController;
  let settingsService: MockSettingService;

  beforeEach(async(() => {
    navParams = new MockNavParams();
    modalController = new MockModalController();
    settingsService = new MockSettingService();
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [RequestPage],
      imports: [
        IonicModule.forRoot(RequestPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavParams, useValue: navParams },
        { provide: ModalController, useValue: modalController },
        { provide: SettingsService, useValue: settingsService },
        { provide: NavController, useValue: navController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});