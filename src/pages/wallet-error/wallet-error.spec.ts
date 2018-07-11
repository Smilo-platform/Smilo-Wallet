import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams, ViewController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";
import { WalletErrorPage } from "./wallet-error";
import { MockViewController } from "../../../test-config/mocks/MockViewController";

describe("NavHeader", () => {
  let comp: WalletErrorPage;
  let fixture: ComponentFixture<WalletErrorPage>;
  let navController: MockNavController;
  let navParams: MockNavParams;
  let viewController: MockViewController;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    viewController = new MockViewController();

    TestBed.configureTestingModule({
      declarations: [WalletErrorPage],
      imports: [
        IonicModule.forRoot(WalletErrorPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: ViewController, useValue: viewController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletErrorPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should initialize correctly", () => {
    expect(this.error).toBeUndefined();
  });

  it("should call dismiss on the viewcontroller when going back", () => {
    spyOn(viewController, "dismiss");

    comp.goBack();

    expect(viewController.dismiss).toHaveBeenCalled();
  });

}); 