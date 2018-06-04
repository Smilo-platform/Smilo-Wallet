import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletOverviewPage } from "./wallet-overview";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("WalletOverviewPage", () => {
  let comp: WalletOverviewPage;
  let fixture: ComponentFixture<WalletOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletOverviewPage],
      imports: [
        IonicModule.forRoot(WalletOverviewPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletOverviewPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});