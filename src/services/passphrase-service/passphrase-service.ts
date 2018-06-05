import { Injectable } from "@angular/core";

export interface IPassphraseService {
    generate(wordCount: number): string[];
}

@Injectable()
export class PassphraseService implements IPassphraseService {
    generate(wordCount: number): string[] {
        let words: string[] = [];

        for(let i = 0; i < wordCount; i++) {
            words.push("word " + i.toString());
        }

        return words;
    }
}