import "seedrandom";

export class SeededRandom {
    private prng: any;

    constructor(seed) {
        this.prng = (<any>Math).seedRandom(seed);
    }

    next(): number {
        return this.prng();
    }

    getRandomBytes(count: number): Uint8Array {
        let randomBytes = new Uint8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(this.prng() * 0xFF);
        }

        return randomBytes;
    }
}