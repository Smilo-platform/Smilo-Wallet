import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TransferPage } from "./transfer";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";

describe("TransferPage", () => {
  let comp: TransferPage;
  let fixture: ComponentFixture<TransferPage>;
  let navController: NavController;
  let navParams: MockNavParams;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [TransferPage],
      imports: [
        IonicModule.forRoot(TransferPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});