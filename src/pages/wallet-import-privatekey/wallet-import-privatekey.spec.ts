import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportPrivatekeyPage } from "./wallet-import-privatekey";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletImportPrivatekeyPage", () => {
  let comp: WalletImportPrivatekeyPage;
  let fixture: ComponentFixture<WalletImportPrivatekeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletImportPrivatekeyPage],
      imports: [
        IonicModule.forRoot(WalletImportPrivatekeyPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportPrivatekeyPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});