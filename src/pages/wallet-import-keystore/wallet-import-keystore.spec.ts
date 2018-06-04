import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportKeystorePage } from "./wallet-import-keystore";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletImportKeystorePage", () => {
  let comp: WalletImportKeystorePage;
  let fixture: ComponentFixture<WalletImportKeystorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletImportKeystorePage],
      imports: [
        IonicModule.forRoot(WalletImportKeystorePage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportKeystorePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});