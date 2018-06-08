import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletImportKeystorePage } from "./wallet-import-keystore";
import { IonicModule, NavController, NavParams, ToastController} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletService, IWalletService } from "../../services/wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { IKeyStoreService, KeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { MockCryptoKeyService } from "../../../test-config/mocks/MockCryptoKeyService";
import { ICryptoKeyService, CryptoKeyService } from "../../services/crypto-key-service/crypto-key-service";
import { NavigationHelperService } from "../../services/navigation-helper-service/navigation-helper-service";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockToastController } from "../../../test-config/mocks/MockToastController";

describe("WalletImportKeystorePage", () => {
  let comp: WalletImportKeystorePage;
  let fixture: ComponentFixture<WalletImportKeystorePage>;
  let navController: NavController;
  let navParams: NavParams;
  let walletService: IWalletService;
  let keyStoreService: IKeyStoreService;
  let cryptoKeyService: ICryptoKeyService;
  let navigationHelperService: NavigationHelperService;
  let translateService: TranslateService;
  let toastController: ToastController;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    walletService = new MockWalletService();
    keyStoreService = new MockKeyStoreService();
    cryptoKeyService = new MockCryptoKeyService();
    navigationHelperService = new NavigationHelperService();
    translateService = new MockTranslateService();
    toastController = new MockToastController();

    TestBed.configureTestingModule({
      declarations: [WalletImportKeystorePage],
      imports: [
        IonicModule.forRoot(WalletImportKeystorePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: KeyStoreService, useValue: keyStoreService },
        { provide: CryptoKeyService, useValue: cryptoKeyService },
        { provide: NavigationHelperService, useValue: navigationHelperService },
        { provide: ToastController, useValue: toastController },
        { provide: TranslateService, useValue: translateService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportKeystorePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});