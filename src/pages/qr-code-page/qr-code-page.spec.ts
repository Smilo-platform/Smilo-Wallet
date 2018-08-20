import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams, ViewController} from "ionic-angular/index";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { QrCodePage } from "./qr-code-page";
import { MockViewController } from "../../../test-config/mocks/MockViewController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { MockQRGeneratorService } from "../../../test-config/mocks/MockQRGeneratorService";
import { QRGeneratorService } from "../../services/qr-generator-service/qr-generator-service";

describe("QrCodePage", () => {
  let comp: QrCodePage;
  let fixture: ComponentFixture<QrCodePage>;
  let viewController: MockViewController;
  let navParams: MockNavParams;
  let qrGeneratorService: MockQRGeneratorService;

  beforeEach(async(() => {
    viewController = new MockViewController();

    TestBed.configureTestingModule({
      declarations: [QrCodePage],
      imports: [
        IonicModule.forRoot(QrCodePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: ViewController, useValue: viewController },
        { provide: NavParams, useValue: navParams },
        { provide: QRGeneratorService, useValue: qrGeneratorService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should call dismiss on the viewcontroller", () => {
    spyOn(viewController, "dismiss");

    comp.dismiss();

    expect(viewController.dismiss).toHaveBeenCalled();
  });

});  