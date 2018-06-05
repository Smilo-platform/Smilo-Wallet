import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPasswordPage } from "./wallet-new-password";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";

describe("WalletNewPasswordPage", () => {
  let comp: WalletNewPasswordPage;
  let fixture: ComponentFixture<WalletNewPasswordPage>;
  let navController: NavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [WalletNewPasswordPage],
      imports: [
        IonicModule.forRoot(WalletNewPasswordPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPasswordPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());
});