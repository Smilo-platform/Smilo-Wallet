import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPasswordPage } from "./wallet-new-password";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { WalletNewDisclaimerPage } from "../wallet-new-disclaimer/wallet-new-disclaimer";
import { IPasswordService, PasswordService } from "../../services/password-service/password-service";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { ComponentsModule } from "../../components/components.module";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";

describe("WalletNewPasswordPage", () => {
  let comp: WalletNewPasswordPage;
  let fixture: ComponentFixture<WalletNewPasswordPage>;
  let navController: NavController;
  let bulkTranslateService: BulkTranslateService;
  let passwordService: IPasswordService;
  let navParams: NavParams;

  beforeEach(async(() => {
    navController = new MockNavController();
    navParams = new MockNavParams();
    bulkTranslateService = new MockBulkTranslateService();
    passwordService = new MockPasswordService();

    TestBed.configureTestingModule({
      declarations: [WalletNewPasswordPage],
      imports: [
        IonicModule.forRoot(WalletNewPasswordPage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: navParams },
        { provide: BulkTranslateService, useValue: bulkTranslateService },
        { provide: PasswordService, useValue: passwordService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    let realGetFunction = navParams.get;

    spyOn(navParams, "get").and.callFake((key) => {
      if(key == "passphrase") {
        // Return mocked passphrase
        return [
          "one", "two", "three", "four", "five", "six",
          "seven", "eight", "nine", "ten", "eleven", "twelve"
        ];
      }
      else {
        // Call real
        return realGetFunction.call(navParams);
      }
    });
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPasswordPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialised correctly", () => {
    expect(comp.enteredPassword).toEqual("");
    expect(comp.validatedPassword).toEqual("");
  });

  it("should store the passphrase passed through the NavParams service", () => {
    expect(comp.passphrase).toEqual([
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ]);
  });

  it("should validate the password when the password is changed", () => {
    spyOn(passwordService, "validate").and.returnValue({type: "success"});

    comp.enteredPassword = "password";
    comp.validatedPassword = "passwordConfirm";

    comp.onPasswordsChanged();

    expect(passwordService.validate).toHaveBeenCalledWith("password", "passwordConfirm");
    expect(comp.passwordStatus).toEqual({type: "success"});
  });

  it("should go to the disclaimer page correctly", () => {
    // Fake the user having entered a valid password
    spyOn(comp, "passwordsArePristine").and.returnValue(false);
    spyOn(comp, "passwordsAreValid").and.returnValue(true);

    comp.enteredPassword = "pass123";

    spyOn(navController, "push");

    comp.next();

    expect(navController.push).toHaveBeenCalledWith(WalletNewDisclaimerPage, {
      passphrase: [
        "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve"
      ],
      password: "pass123"
    });
  });

  it("should correctly detect when the password fields are pristine", () => {
    expect(comp.passwordsArePristine()).toBe(true);

    comp.enteredPassword = "pass123";

    expect(comp.passwordsArePristine()).toBe(true);

    comp.validatedPassword = "pass123";

    expect(comp.passwordsArePristine()).toBe(false);
  });

  it("should correctly detect when the passwords do not match", () => {
    comp.enteredPassword = "pass123";
    comp.validatedPassword = "pass123";

    expect(comp.passwordsAreValid()).toBe(true);

    comp.validatedPassword = "321ssap";
    expect(comp.passwordsAreValid()).toBe(false);
  });

  it("should return nothing when the passwords don't match", () => {
    spyOn(comp, "passwordsAreValid").and.returnValue(false);

    spyOn(comp, "passwordsArePristine");

    spyOn(navController, "push");

    comp.next();

    expect(navController.push).not.toHaveBeenCalled();
  })
});