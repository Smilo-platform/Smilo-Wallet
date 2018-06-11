import { Injectable } from "@angular/core";

export interface IPassphraseService {
    generate(wordCount: number): string[];

    passphraseStringToWords(passphrase: string): string[];

    isValid(passphrase: string, expectedWordCount: number): boolean;
}

@Injectable()
export class PassphraseService implements IPassphraseService {
    passphraseStringToWords(passphrase: string): string[] {
        let words = passphrase.split(" ");

        return words.filter(x => x.trim().length > 0);
    }

    isValid(passphrase: string, expectedWordCount: number): boolean {
        let words = this.passphraseStringToWords(passphrase);

        return words.length == expectedWordCount;
    }

    generate(wordCount: number): string[] {
        let words: string[] = [];

        for(let i = 0; i < wordCount; i++) {
            words.push("word " + i.toString());
        }

        return words;
    }
}