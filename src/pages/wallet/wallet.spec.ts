import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletPage } from "./wallet";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletPage", () => {
  let comp: WalletPage;
  let fixture: ComponentFixture<WalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletPage],
      imports: [
        IonicModule.forRoot(WalletPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});