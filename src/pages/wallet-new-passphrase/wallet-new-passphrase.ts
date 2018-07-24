import { Component, isDevMode } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { WalletNewPasswordPage } from "../wallet-new-password/wallet-new-password";
import { BIP39Service } from "../../services/bip39-service/bip39-service";

declare type State = "showPassphrase" | "enterPassphrase";

@IonicPage()
@Component({
  selector: "page-wallet-new-passphrase",
  templateUrl: "wallet-new-passphrase.html",
})
export class WalletNewPassphrasePage {

  words: string[] = [];
  shuffledWords: string[] = [];
  enteredIndices: number[] = [];

  passphraseIsValid: boolean = false;

  state: State = "showPassphrase";

  resetClickCount: number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private bip39Service: BIP39Service) {
    
  }

  ionViewDidLoad() {
    this.initialize();
  }

  initialize(): Promise<void> {
    return this.bip39Service.generate(256).then(
      (phrase) => {
        this.words = phrase.split(" ");
      }
    );
  }

  /**
   * Switches to the passphrase enter state.
   */
  goToEnterState() {
    // Shuffle words
    this.shuffleWords();

    this.state = "enterPassphrase";
  }

  /**
   * Moves to the next page.
   */
  next() {
    this.navCtrl.push(WalletNewPasswordPage, {
      passphrase: this.words
    });
  }

  /**
   * Resets the entered words collection.
   */
  reset() {
    this.enteredIndices = [];

    // This code should only be allowed to run in development environment!
    // It allows testers to click the reset button three times
    // to quickly fill the passphrase box.
    this.resetClickCount++;
    if(this.resetClickCount % 3 == 0 && isDevMode()) {
      this.enteredIndices = [];
      for(let word of this.words) {
        let index = this.shuffledWords.indexOf(word);

        this.enteredIndices.push(index);
      }
      this.validatePassphrase();
    }
  }

  /**
   * Validates if the entered passphrase is correct.
   */
  validatePassphrase() {
    let isValid = true;

    for(let i = 0; i < this.words.length; i++) {
      let originalWord = this.words[i];
      let enteredWord = this.shuffledWords[this.enteredIndices[i]];

      if(originalWord != enteredWord) {
        // Passphrase was not entered correctly
        isValid = false;
        break;
      }
    }

    this.passphraseIsValid = isValid;
  }

  /**
   * Picks the given word index and adds it to the entered word indices collection.
   * @param word 
   */
  pickWordIndex(index: number) {
    // Extra check to prevent clicking on already clicked words.
    if(this.isPickedWordIndex(index))
      return;

    this.enteredIndices.push(index);

    if(this.enteredIndices.length == this.words.length) {
      this.validatePassphrase();
    }
  }

  /**
   * Undos a picked word index.
   * @param index 
   */
  unpickWordIndex(index: number) {
    // Make sure the word was actually picked
    if(!this.isPickedWordIndex(index))
      return;

    let arrayIndex = this.enteredIndices.indexOf(index);

    this.enteredIndices.splice(arrayIndex, 1);
  }

  /**
   * Returns true if the given word index was already picked by the user.
   * @param index 
   */
  isPickedWordIndex(index: number): boolean {
    return this.enteredIndices.indexOf(index) != -1;
  }

  /**
   * Shuffles the words array and stores the result in shuffledWords.
   */
  shuffleWords() {
    this.shuffledWords = this.words.slice();

    for(let i = this.words.length - 1; i > 0; i--) {
      let index = Math.floor(Math.random() * (i + 1));

      [this.shuffledWords[i], this.shuffledWords[index]] = [this.shuffledWords[index], this.shuffledWords[i]];
    }
  }
}
