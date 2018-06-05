import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPage } from "./wallet-new";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletNewPage", () => {
  let comp: WalletNewPage;
  let fixture: ComponentFixture<WalletNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletNewPage],
      imports: [
        IonicModule.forRoot(WalletNewPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});