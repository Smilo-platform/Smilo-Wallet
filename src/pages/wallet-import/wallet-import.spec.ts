import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportPage } from "./wallet-import";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { RestoreBackupPage } from "../restore-backup/restore-backup";
import { ComponentsModule } from "../../components/components.module";

describe("WalletImportPage", () => {
  let comp: WalletImportPage;
  let fixture: ComponentFixture<WalletImportPage>;
  let navController: NavController;
  let navParams: NavParams;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();

    TestBed.configureTestingModule({
      declarations: [WalletImportPage],
      imports: [
        IonicModule.forRoot(WalletImportPage),
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
    let realGetFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key) => {
      if(key == "NAVIGATION_ORIGIN") {
        return "home";
      }
      else {
        realGetFunction.call(navParams, key);
      }
    });
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should open the import keystore file page correctly", () => {
    spyOn(navController, "push");

    comp.openImportKeystorePage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportKeystorePage, {NAVIGATION_ORIGIN: "home"});
  });

  it("should open the import privatekey pagecorrectly", () => {
    spyOn(navController, "push");

    comp.openImportPrivatekeyPage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportPrivatekeyPage, {NAVIGATION_ORIGIN: "home"});
  });

  it("should open the import ledger page correctly", () => {
    spyOn(navController, "push");

    comp.openImportLedgerPage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportLedgerPage, {NAVIGATION_ORIGIN: "home"});
  });

  it("should open the restore backup page correctly", () => {
    spyOn(navController, "push");

    comp.openRestoreBackupPage();

    expect(navController.push).toHaveBeenCalledWith(RestoreBackupPage, {NAVIGATION_ORIGIN: "home"});
  });
});