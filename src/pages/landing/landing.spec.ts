import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LandingPage } from "./landing";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { WalletPage } from "../wallet/wallet";
import { RestoreBackupPage } from "../restore-backup/restore-backup";
import { TranslateModule, TranslateService, TranslatePipe, TranslateLoader } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockTranslatePipe } from "../../../test-config/mocks/MockTranslatePipe";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { Observable } from "rxjs/Observable";

describe("LandingPage", () => {
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  let navController: MockNavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [
        IonicModule.forRoot(LandingPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should go to the import wallet page", () => {
    spyOn(navController, "push");

    comp.openNewWallet();

    expect(navController.push).toHaveBeenCalledWith(WalletPage, {NAVIGATION_ORIGIN: "landing"});
  });

  it("should go to the restore backup page", () => {
    spyOn(navController, "push");

    comp.openRestoreBackup();

    expect(navController.push).toHaveBeenCalledWith(RestoreBackupPage, {NAVIGATION_ORIGIN: "landing"});
  });
});