import { Injectable } from "@angular/core";

declare var forge: any;

export const PASSPHRASE_ENTROPY = 128;

export interface IPassphraseService {
    generate(wordCount: number): string[];

    passphraseStringToWords(passphrase: string): string[];

    isValid(passphrase: string, expectedWordCount: number): boolean;
}

@Injectable()
export class PassphraseService implements IPassphraseService {
    /**
     * The active word list. This will be loaded 'on the fly'
     */
    private activeWordList: string[];

    passphraseStringToWords(passphrase: string): string[] {
        let words = passphrase.split(" ");

        return words.filter(x => x.trim().length > 0);
    }

    isValid(passphrase: string, expectedWordCount: number): boolean {
        let words = this.passphraseStringToWords(passphrase);

        return words.length == expectedWordCount;
    }

    generate(wordCount: number): string[] {
        // Right now we support 12 words with an entropy of 128 bits
        // 128 bits means we use 8 bytes.

        let checkSumSize = PASSPHRASE_ENTROPY / 32;

        let entropy = forge.random.getBytesSync(PASSPHRASE_ENTROPY / 8);

        // Get the checksum
        

        let words: string[] = [];

        for(let i = 0; i < wordCount; i++) {
            words.push("word " + i.toString());
        }

        return words;
    }
}