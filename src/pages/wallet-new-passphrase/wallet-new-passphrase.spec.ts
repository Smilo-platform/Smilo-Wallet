import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WalletNewPassphrasePage } from "./wallet-new-passphrase";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { WalletNewPasswordPage } from "../wallet-new-password/wallet-new-password";
import { BIP39 } from "@smilo-platform/smilo-commons-js-web";

describe("WalletNewPassphrasePage", () => {
  let comp: WalletNewPassphrasePage;
  let fixture: ComponentFixture<WalletNewPassphrasePage>;
  let navController: MockNavController;
  let bip39: BIP39;

  beforeEach(async(() => {
    navController = new MockNavController();

    TestBed.configureTestingModule({
      declarations: [WalletNewPassphrasePage],
      imports: [
        IonicModule.forRoot(WalletNewPassphrasePage),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: MockTranslationLoader},
        }),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useValue: navController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNewPassphrasePage);
    comp = fixture.componentInstance;
  });

  beforeEach(() => {
    bip39 = (<any>comp).bip39;
  })

  it("should create component", () => expect(comp).toBeDefined());

  it("should be constructed correctly", () => {
    expect(comp.words).toEqual([]);
    expect(comp.shuffledWords).toEqual([]);
    expect(comp.enteredIndices).toEqual([]);
    expect(comp.passphraseIsValid).toBe(false);

    expect(comp.state).toBe("showPassphrase");
  });

  it("should initialize correctly", () => {
    spyOn(bip39, "generate").and.returnValue(
      "one two three four five six seven eight nine ten eleven twelve"
    );

    comp.initialize();

    expect(bip39.generate).toHaveBeenCalledWith(256);

    expect(comp.words).toEqual(
      [
        "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve"
      ]
    );
  });

  it("should clear the entered words when reset is called", () => {
    comp.enteredIndices = [0, 1, 2];

    comp.reset();

    expect(comp.enteredIndices.length).toBe(0);
  });

  it("should validate a correctly entered passphrase correctly", () => {
    comp.words = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    comp.shuffledWords = [
      "twelve", "eleven", "ten", "nine", "eight", "seven",
      "six", "five", "four", "three", "two", "one"
    ];

    comp.enteredIndices = [
      11, 10, 9, 8, 7, 6,
      5, 4, 3, 2, 1, 0
    ];

    comp.validatePassphrase();

    expect(comp.passphraseIsValid).toBe(true);
  });

  it("should validate an incorrectly entered passphrase correctly", () => {
    comp.words = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    comp.shuffledWords = [
      "twelve", "eleven", "ten", "nine", "eight", "seven",
      "six", "five", "four", "three", "two", "one"
    ];

    comp.enteredIndices = [
      1, 2, 3, 4, 5, 6, 
      7, 8, 9, 10, 11, 12
    ];

    comp.validatePassphrase();

    expect(comp.passphraseIsValid).toBe(false);
  });

  it("should add a picked word to the entered words array if it was not yet added", () => {
    comp.pickWordIndex(3);

    expect(comp.enteredIndices).toEqual([3]);

    comp.pickWordIndex(5);

    expect(comp.enteredIndices).toEqual([3, 5]);

    comp.pickWordIndex(2);

    expect(comp.enteredIndices).toEqual([3, 5, 2]);
  });

  it("should not add a picked word to the entered words array if it was already added", () => {
    comp.enteredIndices = [5, 7, 1];

    comp.pickWordIndex(7);

    expect(comp.enteredIndices).toEqual([5, 7, 1]);

    comp.pickWordIndex(1);

    expect(comp.enteredIndices).toEqual([5, 7, 1]);

    comp.pickWordIndex(5);

    expect(comp.enteredIndices).toEqual([5, 7, 1]);
  });

  it("should unpick a picked word correctly", () => {
    comp.enteredIndices = [5, 7, 1];

    comp.unpickWordIndex(7);

    expect(comp.enteredIndices).toEqual([5, 1]);

    comp.unpickWordIndex(5);

    expect(comp.enteredIndices).toEqual([1]);
  });

  it("should not unpick a word which was never picked", () => {
    comp.enteredIndices = [5, 7, 1];

    comp.unpickWordIndex(8);

    expect(comp.enteredIndices).toEqual([5, 7, 1]);

    comp.unpickWordIndex(11);

    expect(comp.enteredIndices).toEqual([5, 7, 1]);
  });

  it("should validate the passphrase once 12 words have been picked", () => {
    comp.words = [
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "twelve"
    ];

    spyOn(comp, "validatePassphrase");

    comp.pickWordIndex(1);
    comp.pickWordIndex(2);
    comp.pickWordIndex(3);
    comp.pickWordIndex(4);
    comp.pickWordIndex(5);
    comp.pickWordIndex(6);
    comp.pickWordIndex(7);
    comp.pickWordIndex(8);
    comp.pickWordIndex(9);
    comp.pickWordIndex(10);
    comp.pickWordIndex(11);
    comp.pickWordIndex(12);

    expect(comp.validatePassphrase).toHaveBeenCalledTimes(1);
  });

  it("should correctly detect when a word has already been picked", () => {
    comp.enteredIndices = [5, 7, 1];

    expect(comp.isPickedWordIndex(1)).toBe(true);
    expect(comp.isPickedWordIndex(7)).toBe(true);

    expect(comp.isPickedWordIndex(12)).toBe(false);
    expect(comp.isPickedWordIndex(3)).toBe(false);
  });

  it("should call initialize in the iondidviewload", () => {
    spyOn(comp, "initialize");

    comp.ionViewDidLoad();

    expect(comp.initialize).toHaveBeenCalled();
  });

  it("should call shuffleWords and set the state to enterPassphrase", () => {
    spyOn(comp, "shuffleWords");

    comp.goToEnterState();

    expect(comp.shuffleWords).toHaveBeenCalled();
    expect(comp.state).toBe("enterPassphrase");
  });

  it("it should navigate to the WalletNewPasswordPage correctly", () => {
    spyOn(navController, "push");

    comp.words = ["word1", "word2"];

    comp.next();

    expect(navController.push).toHaveBeenCalledWith(WalletNewPasswordPage, {passphrase: ["word1", "word2"]});
  });

  it("should increase clickcount and set the entered words to the words array and call validatePassphrase", () => {
    spyOn(comp, "validatePassphrase");
    comp.words = ["word1", "word2"];
    comp.shuffledWords = ["word2", "word1"];
    comp.resetClickCount = 2;

    comp.reset();

    expect(comp.resetClickCount).toBe(3);

    expect(comp.validatePassphrase).toHaveBeenCalled();
    expect(comp.enteredIndices).toEqual([1, 0]);
  });

  it("should shuffle the words array", () => {
    spyOn(Math, "random").and.returnValue(1);
    spyOn(Math, "floor").and.returnValue(1);

    comp.words = ["word1", "word2", "word3", "word4", "word5"];

    comp.shuffleWords();

    expect(comp.shuffledWords).toEqual(['word1', 'word3', 'word4', 'word5', 'word2']);
  });
});