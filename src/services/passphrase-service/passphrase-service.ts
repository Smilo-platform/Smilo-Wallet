import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

declare var forge: any;

export const PASSPHRASE_ENTROPY = 256;

export interface IPassphraseResult {
    entropy: string;
    passphrase: string[];
    seed: string;
    key: string;
}

export interface IPassphraseService {
    generate(entropyBits: number): Promise<IPassphraseResult>;

    passphraseStringToWords(passphrase: string): string[];

    isValid(passphrase: string, expectedWordCount: number): boolean;
}

@Injectable()
export class PassphraseService implements IPassphraseService {
    /**
     * The active word list. This will be loaded 'on the fly'
     */
    private activeWordList: string[];

    constructor(private httpClient: HttpClient) {

    }

    passphraseStringToWords(passphrase: string): string[] {
        let words = passphrase.split(" ");

        return words.filter(x => x.trim().length > 0);
    }

    isValid(passphrase: string, expectedWordCount: number): boolean {
        let words = this.passphraseStringToWords(passphrase);

        return words.length == expectedWordCount;
    }

    getActiveWordList(): Promise<string[]> {
        if(this.activeWordList) {
            return Promise.resolve(this.activeWordList);
        }
        else {
            return this.httpClient.get(
                "assets/bip39/en.txt",
                {
                    responseType: "text"
                }
            ).toPromise().then(
                (response: string) => {
                    return response.split('\n');
                }
            );
        }
    }

    /**
     * Generates entropy for the given amount of bits.
     * The result is returned as an unsigned byte array.
     * @param bits 
     */
    getEntropy(bits: number): string {
        // let entropy = forge.util.bytesToHex(forge.random.getBytesSync(bits / 8));

        // return entropy;

        return "00000000000000000000000000000000";

        // let buffer = forge.util.createBuffer(
        //     forge.random.getBytesSync(bits / 8), 
        //     "raw"
        // );

        // let bytes: number[] = [];
        // while(buffer.length() > 0) {
        //     bytes.push(buffer.getByte());
        // }

        // let byteArray = new Uint8Array(bytes);

        // return byteArray;
    }

    getEntropyCheckSumBitCount(entropy: string): number {
        let bitCount = entropy.length / 2 * 8;

        return bitCount / 32;
    }

    getEntropyCheckSum(entropy: string): number[] {
        let hashedEntropy = this.getHashedEntropy(entropy);

        let checkSumBitCount = this.getEntropyCheckSumBitCount(entropy);

        console.log("Hashed Entropy", hashedEntropy);
        console.log("Check Sum Bit Count", checkSumBitCount);

        let checkSumBits = this.hexStringToBitList(hashedEntropy).slice(0, checkSumBitCount);

        return checkSumBits;
    }

    getSalt(password?: string): string {
        return "mnemonic" + (password || "");
    }
    
    generate(entropyBitCount: number): Promise<IPassphraseResult> {
        return this.getActiveWordList().then(
            (wordList) => {
                // Generate some random entropy
                let entropy = this.getEntropy(entropyBitCount);

                // Get the checksum bits of the entropy
                let checkSumBits = this.getEntropyCheckSum(entropy);

                // Get the total entropy by concatinating the entropy and checksum
                let entropyBits = this.hexStringToBitList(entropy).concat(checkSumBits);

                console.log("Check Sum Bits", checkSumBits);
                console.log("Entropy Bits", entropyBits);

                // Now generate a word for each 11 bits
                let words = [];
                let wordCount = entropyBits.length / 11;
                for(let i = 0; i < wordCount; i++) {
                    let index = 0;
                    for(let j = 0; j < 11; j++) {
                        // Shift bits one place to the left
                        index <<= 1;

                        // Add the next bit in the list using an OR bitmask
                        index |= entropyBits[(i * 11) + j];
                    }

                    words.push(wordList[index]);
                }

                // Generate the passphrase seed
                let passphrase = words.reduce((previous, current) => previous + " " + current, "");
                let salt = this.getSalt();
                let key = forge.pkcs5.pbkdf2(
                    forge.util.createBuffer(passphrase, "utf8"),  // password
                    forge.util.createBuffer(salt, "utf8"),        // salt
                    2048,                                         // iterations
                    512 / 8,                                      // key size in bytes
                    "sha512"                                      // hashing algorithm
                );
                
                // Generate seed
                forge.random.seedFileSync = function(needed) {
                    return key;
                }

                let result: IPassphraseResult = {
                    entropy: entropy,
                    passphrase: words,
                    seed: forge.util.bytesToHex(key),
                    key: forge.util.bytesToHex(key)
                };

                return result;
            }
        );
    }

    getHashedEntropy(entropy: string): string {
        let md = forge.md.sha256.create();

        md.update(entropy);

        let hash = md.digest().toHex();
        
        console.log("true hash", hash);

        return hash;
    }

    hexToNumber(hex: string): number {
        return parseInt(`0x${ hex }`);
    }

    hexToByteArray(hex: string): Uint8Array {
        let bytes: number[] = [];

        let byteCount = hex.length / 2;
        for(let i = 0; i < byteCount; i++) {
            let part = hex.substr(i * 2, 2);

            bytes.push(this.hexToNumber(part));
        }

        return new Uint8Array(bytes);
    }

    hexStringToBitList(hex: string): number[] {
        let bitList = [];

        let byteCount = hex.length / 2;

        for(let i = 0; i < byteCount; i++) {
            let byte = this.hexToNumber(hex.substr(i * 2, 2));
                
            for(let j = 0; j < 8; j++) {
                let index = (i * 8) + j;
                let bit = (byte & (1 << (7 - j))) > 0 ? 1 : 0;

                bitList[index] = bit;
            }
        }

        return bitList;
    }

    // getEntropyHash(entropy: Uint8Array): Uint8Array {
    //     let md = forge.md.sha256.create();

    //     let buffer = forge.util.createBuffer(entropy, 'raw');

    //     md.update(buffer.toHex());

    //     let hashHex = md.digest().toHex();

    //     return this.hexToByteArray(hashHex);
    // }

    // hexToByteArray(hex: string): Uint8Array {
    //     let bytes: number[] = [];

    //     let byteCount = hex.length / 2;
    //     for(let i = 0; i < byteCount; i++) {
    //         let part = hex.substr(i * 2, 2);

    //         bytes.push(this.hexToNumber(part));
    //     }

    //     return new Uint8Array(bytes);
    // }

    // getCheckSumBitList(entropyHexString: string): number[] {
    //     // Check sum size in bits
    //     let checkSumSize = (entropyHexString.length * 4) / 32;

    //     // Get first byte
    //     let byte = entropyHexString.substr(0, 2);
    //     let bitList = this.hexStringToBitList(byte);

    //     return bitList.slice(0, checkSumSize);
    // }

    // hexToNumber(hex: string): number {
    //     return parseInt(`0x${ hex }`);
    // }

    // hexStringToBitList(hex: string): number[] {
    //     let bitList = [];

    //     let byteCount = hex.length / 2;

    //     for(let i = 0; i < byteCount; i++) {
    //         let byte = this.hexToNumber(hex.substr(i * 2, 2));

    //         for(let j = 0; j < 8; j++) {
    //             let index = (i * 8) + j;
    //             bitList[index] = (byte & (1 << j)) > 0 ? 1 : 0;
    //         }
    //     }

    //     return bitList;
    // }

    // byteArrayToBitArray(bytes: Uint8Array): number[] {
    //     let bits: number[] = [];

    //     for(let i = 0; i < bytes.length; i++) {
    //         let byte = bytes[i];

    //         for(let j = 0; j < 8; j++) {
    //             bits.push(((byte & 128 >> j) > 0) ? 1 : 0);
    //         }
    //     }

    //     return bits;
    // }

    // bitArrayToByteArray(bits: number[]): Uint8Array {
    //     let bytes: number[] = [];

    //     let byteCount = bits.length / 8;
    //     for(let i = 0; i < byteCount; i++) {
    //         let byte = 0;

    //         for(let j = 0; j < 8; j++) {
    //             byte <<= 1;
    //             byte |= bits[(i * 8) + j];
    //         }

    //         bytes.push(byte);
    //     }

    //     return new Uint8Array(bytes);
    // }

    // extractChecksumFromEntropy(entropy: Uint8Array): number {
    //     let checkSumBitCount = (entropy.length * 8) / 32;

    //     console.log("Check Sum Bit Count", checkSumBitCount);

    //     let bitMask = 0b11111111 << (8 - checkSumBitCount);

    //     console.log("Bitmask", bitMask);

    //     let checkSum = entropy[0] & bitMask;

    //     return checkSum;
    // }

    // isValidPassphrase(passphrase: string): Promise<boolean> {
    //     return this.getActiveWordList().then(
    //         (wordList) => {
    //             let words = this.passphraseStringToWords(passphrase);

    //             // go back to a bit list
    //             let bitList: number[] = [];
    //             for(let word of words) {
    //                 let wordIndex = wordList.indexOf(word);

    //                 console.log(`${ word } = ${ wordIndex }`);

    //                 for(let i = 10; i >= 0; i--) {
    //                     bitList.push(
    //                         (wordIndex & (1 << i)) > 0 ? 1 : 0
    //                     );
    //                 }
    //             }

    //             // Extract the check sum and entropy
    //             let checkSumBits = bitList.slice(PASSPHRASE_ENTROPY, bitList.length);
    //             let entropyBits = bitList.slice(0, PASSPHRASE_ENTROPY);

    //             let checkSumBytes = this.bitArrayToByteArray(checkSumBits);
    //             let entropyBytes = this.bitArrayToByteArray(entropyBits);

    //             // Get the entropy hash, next extract the expected checksum and check if they match.
    //             let entropyHash = this.getEntropyHash(entropyBytes);

    //             let trueCheckSum = this.extractChecksumFromEntropy(entropyHash);

    //             console.log("Raw bits", bitList);
    //             console.log("Checksum Bits", checkSumBits);
    //             console.log("Entropy Bits", entropyBits);
    //             console.log("Checksum Bytes", checkSumBytes);
    //             console.log("Entropy Bytes", entropyBytes);
    //             console.log("True checksum", trueCheckSum);

    //             if(trueCheckSum != checkSumBytes[0]) {
    //                 // Checksums do not match!
    //                 console.log("Checksums do not match");
    //                 return false;
    //             }

    //             return true;
    //         }
    //     );
    // }

    // getPassphraseRootKey(passphrase: string) {
    //     let salt = "mnemonic" + passphrase;

    //     let key = forge.pkcs5.pbkdf2(passphrase, salt, 2048, 512 / 8);

    //     return forge.util.bytesToHex(key);
    // }

    // generate(wordCount: number): Promise<string[]> {
    //     return this.getActiveWordList().then(
    //         (wordList) => {
    //             let entropy = this.getEntropy(PASSPHRASE_ENTROPY);
    //             let entropyHash = this.getEntropyHash(entropy);

    //             console.log("Entropy", entropy);
    //             console.log("Entropy hash", entropyHash);

    //             let checkSum = this.extractChecksumFromEntropy(entropyHash);

    //             // Get the total entropy by concatinating the entropy and the checksum together
    //             let entropyBits = this.byteArrayToBitArray(entropy);
    //             for(let i = 0; i < PASSPHRASE_ENTROPY / 32; i++) {
    //                 entropyBits.push((checkSum & 128 >> i) > 0 ? 1 : 0)
    //             }

    //             console.log("Bits", entropyBits);

    //             // Now generate a word for each 11 bits
    //             let words = [];
    //             wordCount = entropyBits.length / 11;
    //             for(let i = 0; i < wordCount; i++) {
    //                 let index = 0;
    //                 for(let j = 0; j < 11; j++) {
    //                     // Shift bits one place to the left
    //                     index <<= 1;

    //                     // Add the next bit in the list using an OR bitmask
    //                     index |= entropyBits[(i * 11) + j];
    //                 }

    //                 console.log(`${ wordList[index]} = ${ index }`);

    //                 words.push(wordList[index]);
    //             }
                
    //             return words;

    //             // let random = forge.random.getBytesSync(PASSPHRASE_ENTROPY / 8);
    //             // let buffer = forge.util.createBuffer(random, 'raw');
    //             // console.log(random, typeof(random), buffer, buffer.getByte(0), buffer.length());

    //             // // Do we really want to use a hex string here?
    //             // // Why not just raw bytes?
    //             // let entropyHexString = this.getEntropy(PASSPHRASE_ENTROPY);
    //             // let entropyHash = this.getEntropyHash(entropyHexString);
    //             // let checkSumBitList = this.getCheckSumBitList(entropyHash);

    //             // let bitList = this.hexStringToBitList(entropyHexString);
    //             // bitList = bitList.concat(checkSumBitList);

    //             // console.log(bitList);

    //             // // Now generate a word for each 11 bits
    //             // let words = [];
    //             // wordCount = bitList.length / 11;
    //             // for(let i = 0; i < wordCount; i++) {
    //             //     let index = 0;
    //             //     for(let j = 0; j < 11; j++) {
    //             //         // Shift bits one place to the left
    //             //         index <<= 1;

    //             //         // Add the next bit in the list using an OR bitmask
    //             //         index |= bitList[(i * 11) + j];
    //             //     }

    //             //     console.log(`${ wordList[index]} = ${ index }`);

    //             //     words.push(wordList[index]);
    //             // }

    //             // return words;
    //         }
    //     );
    // }
}