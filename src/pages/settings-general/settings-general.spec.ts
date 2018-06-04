import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsGeneralPage } from "./settings-general";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("SettingsGeneralPage", () => {
  let comp: SettingsGeneralPage;
  let fixture: ComponentFixture<SettingsGeneralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsGeneralPage],
      imports: [
        IonicModule.forRoot(SettingsGeneralPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGeneralPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});