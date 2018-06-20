import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportLedgerPage } from "./wallet-import-ledger";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";

describe("WalletImportLedgerPage", () => {
  let comp: WalletImportLedgerPage;
  let fixture: ComponentFixture<WalletImportLedgerPage>;
  let navController: NavController;
  let navParams: MockNavParams;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [WalletImportLedgerPage],
      imports: [
        IonicModule.forRoot(WalletImportLedgerPage),
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
    fixture = TestBed.createComponent(WalletImportLedgerPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});