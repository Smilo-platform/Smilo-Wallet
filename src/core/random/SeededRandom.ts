import "seedrandom";
import { IPRNG } from "./IPRNG";

export class SeededRandom implements IPRNG {
    private prng: any;

    constructor(seed) {
        this.prng = new (<any>Math).seedrandom(seed);
    }

    setSeed(value: any): void {
        this.prng = new (<any>Math).seedrandom(value);
    }

    next(): number {
        return this.prng();
    }

    getRandomBytes(count: number): Int8Array {
        let randomBytes = new Int8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(this.prng() * 0xFF);
        }

        return randomBytes;
    }
}