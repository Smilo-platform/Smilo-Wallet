import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsWalletPage } from "./settings-wallet";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("SettingsWalletPage", () => {
  let comp: SettingsWalletPage;
  let fixture: ComponentFixture<SettingsWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsWalletPage],
      imports: [
        IonicModule.forRoot(SettingsWalletPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});