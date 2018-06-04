import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletPage } from "./wallet";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { WalletImportKeystorePage } from "../wallet-import-keystore/wallet-import-keystore";
import { WalletImportPrivatekeyPage } from "../wallet-import-privatekey/wallet-import-privatekey";
import { WalletImportLedgerPage } from "../wallet-import-ledger/wallet-import-ledger";
import { RestoreBackupPage } from "../restore-backup/restore-backup";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";

describe("WalletPage", () => {
  let comp: WalletPage;
  let fixture: ComponentFixture<WalletPage>;
  let navController: NavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [WalletPage],
      imports: [
        IonicModule.forRoot(WalletPage),
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
    fixture = TestBed.createComponent(WalletPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should open the import keystore file page correctly", () => {
    spyOn(navController, "push");

    comp.openImportKeystorePage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportKeystorePage);
  });

  it("should open the import privatekey pagecorrectly", () => {
    spyOn(navController, "push");

    comp.openImportPrivatekeyPage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportPrivatekeyPage);
  });

  it("should open the import ledger page correctly", () => {
    spyOn(navController, "push");

    comp.openImportLedgerPage();

    expect(navController.push).toHaveBeenCalledWith(WalletImportLedgerPage);
  });

  it("should open the restore backup page correctly", () => {
    spyOn(navController, "push");

    comp.openRestoreBackupPage();

    expect(navController.push).toHaveBeenCalledWith(RestoreBackupPage);
  });
});