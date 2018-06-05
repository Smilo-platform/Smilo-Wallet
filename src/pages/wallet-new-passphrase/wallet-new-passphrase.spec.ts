import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPassphrasePage } from "./wallet-new-passphrase";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";

describe("WalletNewPassphrasePage", () => {
  let comp: WalletNewPassphrasePage;
  let fixture: ComponentFixture<WalletNewPassphrasePage>;
  let navController: NavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [WalletNewPassphrasePage],
      imports: [
        IonicModule.forRoot(WalletNewPassphrasePage),
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
    fixture = TestBed.createComponent(WalletNewPassphrasePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());
});