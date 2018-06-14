import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPassphrasePage } from "./wallet-new-passphrase";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { PassphraseService } from "../../services/passphrase-service/passphrase-service";

describe("WalletNewPassphrasePage", () => {
  let comp: WalletNewPassphrasePage;
  let fixture: ComponentFixture<WalletNewPassphrasePage>;
  let navController: NavController;
  let passphraseService: PassphraseService;

  beforeEach(async(() => {
    navController = new MockNavController();
    passphraseService = new PassphraseService();

    TestBed.configureTestingModule({
      declarations: [WalletNewPassphrasePage],
      imports: [
        IonicModule.forRoot(WalletNewPassphrasePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: PassphraseService, useValue: passphraseService },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Mock generate passphrase
    spyOn(passphraseService, "generate").and.returnValue(
      [
        "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve"
      ]
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPassphrasePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be initialized correctly", () => {
    expect(comp.words.length).toBe(12);

    expect(comp.passphraseIsValid).toBe(false);

    expect(comp.state).toBe("showPassphrase");
  });

  it("should clear the entered words when reset is called", () => {
    comp.enteredWords = ["some", "more", "words"];

    comp.reset();

    expect(comp.enteredWords.length).toBe(0);
  });

  it("should validate a correctly entered passphrase correctly", () => {
    comp.enteredWords = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    comp.validatePassphrase();

    expect(comp.passphraseIsValid).toBe(true);
  });

  it("should validate an incorrectly entered passphrase correctly", () => {
    comp.enteredWords = [
      "twelve", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "one"
    ];

    comp.validatePassphrase();

    expect(comp.passphraseIsValid).toBe(false);
  });

  it("should add a picked word to the entered words array if it was not yet added", () => {
    comp.pickWord("one");

    expect(comp.enteredWords).toEqual(["one"]);

    comp.pickWord("twelve");

    expect(comp.enteredWords).toEqual(["one", "twelve"]);

    comp.pickWord("three");

    expect(comp.enteredWords).toEqual(["one", "twelve", "three"]);
  });

  it("should not add a picked word to the entered words array if it was already added", () => {
    comp.enteredWords = ["one", "twelve", "three"];

    comp.pickWord("one");

    expect(comp.enteredWords).toEqual(["one", "twelve", "three"]);

    comp.pickWord("twelve");

    expect(comp.enteredWords).toEqual(["one", "twelve", "three"]);

    comp.pickWord("three");

    expect(comp.enteredWords).toEqual(["one", "twelve", "three"]);
  });

  it("should unpick a picked word correctly", () => {
    comp.enteredWords = ["one", "two", "three"];

    comp.unpickWord("one");

    expect(comp.enteredWords).toEqual(["two", "three"]);

    comp.unpickWord("three");

    expect(comp.enteredWords).toEqual(["two"]);
  });

  it("should not unpick a word which was never picked", () => {
    comp.enteredWords = ["one", "two", "three"];

    comp.unpickWord("twelve");

    expect(comp.enteredWords).toEqual(["one", "two", "three"]);

    comp.unpickWord("elevent");

    expect(comp.enteredWords).toEqual(["one", "two", "three"]);
  });

  it("should validate the passphrase once 12 words have been picked", () => {
    spyOn(comp, "validatePassphrase");

    comp.pickWord("one");
    comp.pickWord("two");
    comp.pickWord("three");
    comp.pickWord("four");
    comp.pickWord("five");
    comp.pickWord("six");
    comp.pickWord("seven");
    comp.pickWord("eight");
    comp.pickWord("nine");
    comp.pickWord("ten");
    comp.pickWord("eleven");
    comp.pickWord("twelve");

    expect(comp.validatePassphrase).toHaveBeenCalledTimes(1);
  });

  it("should correctly detect when a word has already been picked", () => {
    comp.enteredWords = ["one", "two", "twelve"];

    expect(comp.isPickedWord("one")).toBe(true);
    expect(comp.isPickedWord("twelve")).toBe(true);

    expect(comp.isPickedWord("eleven")).toBe(false);
    expect(comp.isPickedWord("three")).toBe(false);
  });
});