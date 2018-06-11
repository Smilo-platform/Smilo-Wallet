import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HomePage } from "./home";
import { IonicModule, Platform, NavController} from "ionic-angular/index";
import { TranslateModule, TranslateService, TranslatePipe, TranslateLoader } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { MockTranslatePipe } from "../../../test-config/mocks/MockTranslatePipe";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { WalletPage } from "../wallet/wallet";
import { WalletOverviewPage } from "../wallet-overview/wallet-overview";
import { AboutPage } from "../about/about";
import { FaqPage } from "../faq/faq";

describe("HomePage", () => {
  let comp: HomePage;
  let fixture: ComponentFixture<HomePage>;

  let navController: MockNavController;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(HomePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: NavController, useValue: navController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should open the my wallet page correctly", () => {
    spyOn(navController, "push");

    comp.openMyWallet();

    expect(navController.push).toHaveBeenCalledWith(WalletOverviewPage);
  });

  it("should open the new wallet page correctly", () => {
    spyOn(navController, "push");

    comp.openNewWallet();

    expect(navController.push).toHaveBeenCalledWith(WalletPage, {NAVIGATION_ORIGIN: "home"});
  });

  it("should open the about page correctly", () => {
    spyOn(navController, "push");

    comp.openAbout();

    expect(navController.push).toHaveBeenCalledWith(AboutPage);
  });

  it("should open the faq page correctly", () => {
    spyOn(navController, "push");

    comp.openFaq();

    expect(navController.push).toHaveBeenCalledWith(FaqPage);
  });
});