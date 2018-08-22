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
		expect(comp.passwordFeedbackWarning).toEqual([], "passwordFeedbackWarning should be an empty array");
		expect(comp.onlineThrottlingMessage).toBe("-", "onlineThrottlingMessage should be '-'");
		expect(comp.onlineNoThrottlingMessage).toBe("-", "onlineNoThrottlingMessage should be '-'");
		expect(comp.offlineSlowHashingMessage).toBe("-", "offlineSlowHashingMessage should be '-'");
		expect(comp.offlineFastHashingMessage).toBe("-", "offlineFastHashingMessage should be '-'");
		expect(comp.showPasswordAdvanced).toBeFalsy("showPasswordAdvanced should be false");
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

	it("should set the password advanced boolean as the opposite as it was before the call", () => {
		comp.showPasswordAdvanced = false;

		comp.togglePasswordAdvanced();

		expect(comp.showPasswordAdvanced).toBeTruthy("showPasswordAdvanced should be truthy");

		comp.togglePasswordAdvanced();

		expect(comp.showPasswordAdvanced).toBeFalsy("showPasswordAdvanced should be falsy");
	});

	it("should check the password on changes", () => {
		spyOn(comp, "checkPassword");

		comp.ngOnChanges(null);

		expect(comp.checkPassword).toHaveBeenCalled();
	});

	it("should check the given password, set the password strength object and make calls for strength texts (basic and advanced)" ,() => {
		spyOn(passwordService, "passwordStrength").and.returnValue({score: 4});
		spyOn(comp, "setPasswordBasicText");
		spyOn(comp, "setPasswordAdvancedText");

		comp.password = "supersecure1337";

		comp.checkPassword();

		expect(comp.passwordStrengthScore).toBe(4, "passwordStrengthScore should be 4");
		expect(comp.setPasswordBasicText).toHaveBeenCalled();
		expect(comp.setPasswordAdvancedText).toHaveBeenCalled();
	});

	it("should make a call to reset the advanced password fields", () => {
		spyOn(comp, "resetAdvancedPasswordFields");

		comp.password = null;

		comp.checkPassword();

		expect(comp.resetAdvancedPasswordFields).toHaveBeenCalled();
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

	it("should set the advanced texts according the password strength object", () => {
		// Cast it to any for now so we only set the objects that are expected in this method
		comp.passwordStrength = <any>{ 
			crack_times_display: {   
					online_throttling_100_per_hour: "4 seconds",
					online_no_throttling_10_per_second: "3 seconds",
					offline_slow_hashing_1e4_per_second: "2 seconds",
					offline_fast_hashing_1e10_per_second: "1 second"
				},
			feedback: {
				suggestions: [
						"chocolate should taste like chicken",
						"world domination for barbies"
				]
			}
		};
		
		comp.setPasswordAdvancedText();

		expect(comp.onlineThrottlingMessage).toEqual("4 seconds", "onlineThrottlingMessage should equal 4 seconds");
		expect(comp.onlineNoThrottlingMessage).toEqual("3 seconds", "onlineThrottlingMessage should equal 3 seconds");
		expect(comp.offlineSlowHashingMessage).toEqual("2 seconds", "onlineThrottlingMessage should equal 2 seconds");
		expect(comp.offlineFastHashingMessage).toEqual("1 second", "onlineThrottlingMessage should equal 1 second");

		expect(comp.passwordFeedbackWarning[0]).toEqual("1. chocolate should taste like chicken");
		expect(comp.passwordFeedbackWarning[1]).toEqual("2. world domination for barbies");
	});

	it("should reset the advanced password fields to initialized values", () => {
		comp.passwordFeedbackWarning = ["should disappear", "this one to", "this also"];
        comp.onlineThrottlingMessage = "should disappear pear";
        comp.onlineNoThrottlingMessage = "should disappear apple";
        comp.offlineSlowHashingMessage = "should disappear pinapple";
        comp.offlineFastHashingMessage = "should disappear orange";

		comp.resetAdvancedPasswordFields();

		expect(comp.passwordFeedbackWarning).toEqual([]);
		expect(comp.onlineThrottlingMessage).toEqual("-", "onlineThrottlingMessage should equal '-'");
		expect(comp.onlineNoThrottlingMessage).toEqual("-", "onlineNoThrottlingMessage should equal '-'");
		expect(comp.offlineSlowHashingMessage).toEqual("-", "offlineSlowHashingMessage should equal '-'");
		expect(comp.offlineFastHashingMessage).toEqual("-", "offlineFastHashingMessage should equal '-'");
	});
});