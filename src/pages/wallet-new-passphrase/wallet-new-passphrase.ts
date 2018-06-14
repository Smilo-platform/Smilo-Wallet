import { Component } from "@angular/core";
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
  enteredWords: string[] = [];

  passphraseIsValid: boolean = false;

  state: State = "showPassphrase";

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
        this.words = phrase.split(" ")
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
    this.enteredWords = [];
  }

  /**
   * Validates if the entered passphrase is correct.
   */
  validatePassphrase() {
    let isValid = true;

    for(let i = 0; i < this.words.length; i++) {
      let originalWord = this.words[i];
      let enteredWord = this.enteredWords[i];

      if(originalWord != enteredWord) {
        // Passphrase was not entered correctly
        isValid = false;
        break;
      }
    }

    this.passphraseIsValid = isValid;
  }

  /**
   * Picks the given words and adds it to the entered words collection.
   * @param word 
   */
  pickWord(word: string) {
    // Extra check to prevent clicking on already clicked words.
    if(this.isPickedWord(word))
      return;

    this.enteredWords.push(word);

    if(this.enteredWords.length == this.words.length) {
      this.validatePassphrase();
    }
  }

  isPickedWord(word: string): boolean {
    return this.enteredWords.indexOf(word) != -1;
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
