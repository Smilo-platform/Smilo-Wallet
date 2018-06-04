import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportLedgerPage } from "./wallet-import-ledger";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletImportLedgerPage", () => {
  let comp: WalletImportLedgerPage;
  let fixture: ComponentFixture<WalletImportLedgerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletImportLedgerPage],
      imports: [
        IonicModule.forRoot(WalletImportLedgerPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportLedgerPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});