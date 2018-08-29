import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams } from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { PasswordStrengthComponent } from "./password-strength";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { PasswordService, IPasswordService } from "../../services/password-service/password-service";
import { MockPasswordService } from "../../../test-config/mocks/MockPasswordService";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";
import { map } from "rxjs/operators";

describe("PasswordStrength", () => {
	let comp: PasswordStrengthComponent;
	let fixture: ComponentFixture<PasswordStrengthComponent>;
	let navController: MockNavController;
	let bulkTranslateService: BulkTranslateService;
	let passwordService: IPasswordService;
	let translateService: TranslateService;

	beforeEach(async(() => {
		navController = new MockNavController();
		bulkTranslateService = new MockBulkTranslateService();
		passwordService = new MockPasswordService();
		translateService = new MockTranslateService();

		TestBed.configureTestingModule({
			declarations: [PasswordStrengthComponent],
			imports: [
				IonicModule.forRoot(PasswordStrengthComponent),
				TranslateModule.forRoot({
					loader: { provide: TranslateLoader, useClass: MockTranslationLoader },
				})
			],
			providers: [
				{ provide: NavController, useValue: navController },
				{ provide: PasswordService, useValue: passwordService },
				{ provide: TranslateService, useValue: translateService },
				{ provide: BulkTranslateService, useValue: bulkTranslateService }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PasswordStrengthComponent);
		comp = fixture.componentInstance;
	});

	it("should create component", () => expect(comp).toBeDefined());

	it("should initialize correctly", () => {
		expect(comp.password).toBeUndefined("password should be undefined");
		expect(comp.translations).toEqual(new Map<string, string>(), "translations should be an empty map");
		expect(comp.passwordStrength).toBeUndefined("passwordStrength should be undefined");
		expect(comp.passwordStrengthScore).toBe(0, "passwordStrengthScore should be 0");
		expect(comp.passwordStrengthScoreText).toBeUndefined("passwordStrengthScoreText should be undefined");
	});
	
	it("should make a call to get and subscribe to translations", () => {
		spyOn(comp, "getAndSubscribeToTranslations");

		comp.ngOnInit();
		
		expect(comp.getAndSubscribeToTranslations).toHaveBeenCalled();
	});

	it("should get and subscribe to translations", () => {
		spyOn(translateService.onLangChange, "subscribe");
		spyOn(comp, "retrieveTranslations").and.returnValue(Promise.resolve());

		comp.getAndSubscribeToTranslations();

		expect(translateService.onLangChange.subscribe).toHaveBeenCalled();
		expect(comp.retrieveTranslations).toHaveBeenCalled();
	});

	it("should retrieve translations in bulk and set the translations object", (done) => {
		spyOn(bulkTranslateService, "getTranslations").and.returnValue(Promise.resolve(new Map([["key1", "value1"], ["key2", "value2"]])));

		comp.retrieveTranslations().then(data => {
			expect(comp.translations.get("key1")).toEqual("value1", "key1 should equal value1");
			expect(comp.translations.get("key2")).toEqual("value2", "key2 should equal value2");
			done();
		});
	});

	it("should check the password on changes", () => {
		spyOn(comp, "checkPassword");

		comp.ngOnChanges(null);

		expect(comp.checkPassword).toHaveBeenCalled();
	});

	it("should check the given password, set the password strength object and make calls for strength texts (basic and advanced)" ,() => {
		spyOn(passwordService, "passwordStrength").and.returnValue({score: 4});
		spyOn(comp, "setPasswordBasicText");

		comp.password = "supersecure1337";

		comp.checkPassword();

		expect(comp.passwordStrengthScore).toBe(4, "passwordStrengthScore should be 4");
		expect(comp.setPasswordBasicText).toHaveBeenCalled();
	});

	it("should set translated texts according the password strength score", () => {
		comp.translations.set("password-strength-component.fill-strong-password", "trans1");
		comp.translations.set("password-strength-component.password-weak", "trans2");
		comp.translations.set("password-strength-component.password-normal", "trans3");
		comp.translations.set("password-strength-component.password-good", "trans4");
		comp.translations.set("password-strength-component.password-excellent", "trans5");

		comp.passwordStrengthScore = 0;
		comp.setPasswordBasicText();
		expect(comp.passwordStrengthScoreText).toEqual("trans1", "passwordStrengthScoreText should equal trans1");

		comp.passwordStrengthScore = 1;
		comp.setPasswordBasicText();
		expect(comp.passwordStrengthScoreText).toEqual("trans2", "passwordStrengthScoreText should equal trans2");

		comp.passwordStrengthScore = 2;
		comp.setPasswordBasicText();
		expect(comp.passwordStrengthScoreText).toEqual("trans3", "passwordStrengthScoreText should equal trans3");

		comp.passwordStrengthScore = 3;
		comp.setPasswordBasicText();
		expect(comp.passwordStrengthScoreText).toEqual("trans4", "passwordStrengthScoreText should equal trans4");

		comp.passwordStrengthScore = 4;
		comp.setPasswordBasicText();
		expect(comp.passwordStrengthScoreText).toEqual("trans5", "passwordStrengthScoreText should equal trans5");
	});
});