export interface IPRNG {
    setSeed(value: any): void;

    next(): number;

    getRandomBytes(count: number): Int8Array;
}