import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FaqPage } from "./faq";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("FAQPage", () => {
  let comp: FaqPage;
  let fixture: ComponentFixture<FaqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaqPage],
      imports: [
        IonicModule.forRoot(FaqPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});