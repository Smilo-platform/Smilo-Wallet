import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { PasswordStrengthComponent } from "./password-strength";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";

describe("PasswordStrength", () => {
  let comp: PasswordStrengthComponent;
  let fixture: ComponentFixture<PasswordStrengthComponent>;
  let navController: MockNavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [PasswordStrengthComponent],
      imports: [
        IonicModule.forRoot(PasswordStrengthComponent),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordStrengthComponent);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

});