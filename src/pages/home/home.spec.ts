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
import { SplashScreen } from "@ionic-native/splash-screen";
import { MockSplashScreen } from "../../../test-config/mocks/MockSplashScreen";
import { ComponentsModule } from "../../components/components.module";

describe("HomePage", () => {
  let comp: HomePage;
  let fixture: ComponentFixture<HomePage>;

  let navController: MockNavController;
  let splashScreen: SplashScreen;

  beforeEach(async(() => {
    navController = new MockNavController();
    splashScreen = new MockSplashScreen();

    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(HomePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: SplashScreen, useValue: splashScreen }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should hide the splashscreen correctly", () => {
    spyOn(window, "setTimeout").and.callFake(
      (callback, time) => {

        // just call callback immediately
        callback();
      }
    );

    spyOn(splashScreen, "hide");

    comp.ionViewDidEnter();

    expect(splashScreen.hide).toHaveBeenCalled();
  });

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