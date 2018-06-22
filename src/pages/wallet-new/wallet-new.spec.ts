import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPage } from "./wallet-new";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletNewPassphrasePage } from "../wallet-new-passphrase/wallet-new-passphrase";
import { ComponentsModule } from "../../components/components.module";

describe("WalletNewPage", () => {
  let comp: WalletNewPage;
  let fixture: ComponentFixture<WalletNewPage>;
  let navController: NavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [WalletNewPage],
      imports: [
        IonicModule.forRoot(WalletNewPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should show the first warning page first", () => {
    expect(comp.warningState).toBe("first");
  });

  it("should open the passphrase page correctly", () => {
    spyOn(navController, "push");

    comp.goToPassphrasePage();

    expect(navController.push).toHaveBeenCalledWith(WalletNewPassphrasePage);
  });
});