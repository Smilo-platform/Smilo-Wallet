import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams, ViewController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";
import { PasswordExplanationPage } from "./password-explanation";
import { MockViewController } from "../../../test-config/mocks/MockViewController";

describe("NavHeader", () => {
  let comp: PasswordExplanationPage;
  let fixture: ComponentFixture<PasswordExplanationPage>;
  let viewController: MockViewController;

  beforeEach(async(() => {
    viewController = new MockViewController();

    TestBed.configureTestingModule({
      declarations: [PasswordExplanationPage],
      imports: [
        IonicModule.forRoot(PasswordExplanationPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: ViewController, useValue: viewController },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordExplanationPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should call dismiss on the viewcontroller", () => {
    spyOn(viewController, "dismiss");

    comp.dismiss();

    expect(viewController.dismiss).toHaveBeenCalled();
  });

});  