import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TransferPage } from "./transfer";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockTransactionSignService } from "../../../test-config/mocks/MockTransactionSignService";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { MockTransferTransactionService } from "../../../test-config/mocks/MockTransferTransactionService";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { MockAssetService } from "../../../test-config/mocks/MockAssetService";
import { AssetService } from "../../services/asset-service/asset-service";

describe("TransferPage", () => {
  let comp: TransferPage;
  let fixture: ComponentFixture<TransferPage>;
  let navController: MockNavController;
  let navParams: MockNavParams;
  let transactionSignService: MockTransactionSignService;
  let transferTransactionService: MockTransferTransactionService;
  let bulkTranslateService: BulkTranslateService;
  let assetService: MockAssetService;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    transactionSignService = new MockTransactionSignService();
    transferTransactionService = new MockTransferTransactionService();
    bulkTranslateService = new MockBulkTranslateService();
    assetService = new MockAssetService();

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
        { provide: NavParams, useValue: navParams },
        { provide: TransactionSignService, useValue: transactionSignService },
        { provide: TransferTransactionService, useValue: transferTransactionService },
        { provide: BulkTranslateService, useValue: bulkTranslateService },
        { provide: AssetService, useValue: assetService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});