import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AboutPage } from "./about";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("AboutPage", () => {
  let comp: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutPage],
      imports: [
        IonicModule.forRoot(AboutPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});