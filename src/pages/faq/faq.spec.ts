import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FaqPage } from "./faq";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";

describe("FAQPage", () => {
  let comp: FaqPage;
  let fixture: ComponentFixture<FaqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaqPage],
      imports: [
        IonicModule.forRoot(FaqPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
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