import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPassphrasePage } from "./wallet-new-passphrase";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { IBIP39Service, BIP39Service } from "../../services/bip39-service/bip39-service";
import { MockBIP39Service } from "../../../test-config/mocks/MockBIP39Service";
import { HttpClient } from "@angular/common/http";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";

describe("WalletNewPassphrasePage", () => {
  let comp: WalletNewPassphrasePage;
  let fixture: ComponentFixture<WalletNewPassphrasePage>;
  let navController: NavController;
  let bip39Service: IBIP39Service;
  let httpClient: HttpClient;
  let translateService: TranslateService;

  beforeEach(async(() => {
    navController = new MockNavController();
    bip39Service = new MockBIP39Service();

    TestBed.configureTestingModule({
      declarations: [WalletNewPassphrasePage],
      imports: [
        IonicModule.forRoot(WalletNewPassphrasePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        })
      ],
      providers: [
        { provide: BIP39Service, useValue: bip39Service },
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPassphrasePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());

  it("should be constructed correctly", () => {
    expect(comp.words).toEqual([]);
    expect(comp.shuffledWords).toEqual([]);
    expect(comp.enteredWords).toEqual([]);

    expect(comp.passphraseIsValid).toBe(false);

    expect(comp.state).toBe("showPassphrase");
  });

  it("should initialize correctly", (done) => {
    spyOn(bip39Service, "generate").and.returnValue(
      Promise.resolve("one two three four five six seven eight nine ten eleven twelve")
    );

    comp.initialize().then(
      () => {
        expect(bip39Service.generate).toHaveBeenCalledWith(256);

        expect(comp.words).toEqual(
          [
            "one", "two", "three", "four", "five", "six",
            "seven", "eight", "nine", "ten", "eleven", "twelve"
          ]
        );

        done();
      }
    );
  });

  it("should clear the entered words when reset is called", () => {
    comp.enteredWords = ["some", "more", "words"];

    comp.reset();

    expect(comp.enteredWords.length).toBe(0);
  });

  it("should validate a correctly entered passphrase correctly", () => {
    comp.words = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    comp.enteredWords = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    comp.validatePassphrase();

    expect(comp.passphraseIsValid).toBe(true);
  });

  it("should validate an incorrectly entered passphrase correctly", () => {
    comp.words = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

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