export interface IPRNG {
    setSeed(value: any): void;

    next(): number;

    getRandomBytes(count: number): Uint8Array;
}