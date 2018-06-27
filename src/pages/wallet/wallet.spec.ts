import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletPage } from "./wallet";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletNewPage } from "../wallet-new/wallet-new";
import { WalletImportPage } from "../wallet-import/wallet-import";
import { ComponentsModule } from "../../components/components.module";

describe("WalletPage", () => {
  let comp: WalletPage;
  let fixture: ComponentFixture<WalletPage>;
  let navController: MockNavController;
  let navParams: MockNavParams;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [WalletPage],
      imports: [
        IonicModule.forRoot(WalletPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    let realGetFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key: string) => {
      if(key == "NAVIGATION_ORIGIN") {
        return "home";
      }
      else {
        realGetFunction.call(navParams, key);
      }
    });
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should open the new wallet page correctly", () => {
    spyOn(navController, "push");

    comp.openNewWalletPage();

    expect(navController.push).toHaveBeenCalledWith(WalletNewPage, {NAVIGATION_ORIGIN: "home"});
  });

  it("should open the import wallet page correctly", () => {
    spyOn(navController, "push");

    comp.openLoadWalletPage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportPage, {NAVIGATION_ORIGIN: "home"});
  });
});