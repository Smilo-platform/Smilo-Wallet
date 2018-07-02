import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletExtraImportPage } from "./wallet-extra-import";
import { IonicModule, NavController, NavParams, ViewController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { FormBuilder } from "@angular/forms";

describe("WalletExtraImportPage", () => {
  let comp: WalletExtraImportPage;
  let fixture: ComponentFixture<WalletExtraImportPage>;
  let viewController: ViewController;
  let navParams: NavParams;

  beforeEach(async(() => {
    viewController = new ViewController();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [WalletExtraImportPage],
      imports: [
        IonicModule.forRoot(WalletExtraImportPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: ViewController, useValue: viewController },
        { provide: NavParams, useValue: navParams },
        { provide: FormBuilder, useClass: FormBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Mock nav params
    let originalFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key) => {
        if(key == "nextIndex") {
            return 10;
        }
        else {
            originalFunction.call(navParams, key);
        }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletExtraImportPage);
    comp = fixture.componentInstance;
  });

  it("should be initialized correctly", () => {
    expect(comp.nextIndex).toBe(10);
    expect(comp.form).toBeDefined();
  });

  it("should handle no correctly", () => {
    spyOn(viewController, "dismiss");

    comp.no();

    expect(viewController.dismiss).toHaveBeenCalledWith({
        importExtra: false
    });
  });

  it("should handle yes correctly", () => {
    comp.importAnotherWallet = false;

    comp.yes();

    expect(comp.importAnotherWallet).toBe(true);
  });

  it("should handle back correctly", () => {
    comp.importAnotherWallet = true;

    comp.back();

    expect(comp.importAnotherWallet).toBe(false);
  });

  it("should handle import correctly", () => {
    spyOn(viewController, "dismiss");

    comp.walletName = "WalletName";

    comp.import();

    expect(viewController.dismiss).toHaveBeenCalledWith({
        importExtra: true,
        index: 10,
        name: "WalletName"
    });
  });
});