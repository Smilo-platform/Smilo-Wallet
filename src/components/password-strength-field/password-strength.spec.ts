import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { PasswordStrengthComponent } from "./password-strength";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { PasswordService, IPasswordService } from "../../services/password-service/password-service";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";

describe("PasswordStrength", () => {
  let comp: PasswordStrengthComponent;
  let fixture: ComponentFixture<PasswordStrengthComponent>;
  let navController: MockNavController;
  let bulkTranslateService: BulkTranslateService;
  let passwordService: IPasswordService;

  beforeEach(async(() => {
    navController = new MockNavController();
    bulkTranslateService = new MockBulkTranslateService();
    passwordService = new MockPasswordService();

    TestBed.configureTestingModule({
      declarations: [PasswordStrengthComponent],
      imports: [
        IonicModule.forRoot(PasswordStrengthComponent),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: PasswordService, useValue: passwordService },
        { provide: BulkTranslateService, useValue: bulkTranslateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordStrengthComponent);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

});