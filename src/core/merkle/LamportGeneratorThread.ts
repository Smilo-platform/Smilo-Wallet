// We have to import the LamportGenerator in a special way!
// Because the below LamportGeneratorThread is actually executed as a webworker
// it won't really have access to the LamportGenerator we imported here.
// Instead a javascript file will be imported by the webworker containing the LamportGenerator implementation.
// Now if we would just say `import { LamportGenerator } from "../random/LamportGenerator"` Typescript/Webpack would
// internally rename the LamportGenerator library to something like `WEBPACK___BLABLABLA_SHA1PRNG` which obviously
// is not the name of the LamportGenerator script the webworker will import.
// Using this simple trick we enforce the class name LamportGenerator stays LamportGenerator.
// import * as lamport from "./LamportGenerator";
// const LamportGenerator = lamport.LamportGenerator;

declare const sjcl: any;

export interface ILamportGeneratorThreadInput {
    startIndex: number,
    seeds: Int8Array[],
    count: number
}

export interface ILamportGeneratorThreadOutput {
    startIndex: number,
    publicKeys: string[]
}

export function LamportGeneratorThread(input: ILamportGeneratorThreadInput, done: (publicKeys: ILamportGeneratorThreadOutput) => void) {
    class SHA1PRNG {
        private md1: any;
        private readonly DIGEST_SIZE: number = 20;
    
        private state: Uint8Array;
        private remainder: Uint8Array;
        private remCount: number = 0;
    
        constructor(seed?: any) {
            if(seed)
                this.setSeed(seed);
        }
    
        setSeed(value: any): void {
            if(value instanceof Uint8Array) {
                // Convert int arrays back to a normal number array
                let convertedValue: number[] = [];
    
                for(let i = 0; i < value.length; i++) {
                    convertedValue[i] = value[i];
                }
    
                value = convertedValue;
            }
            else if(value instanceof Int8Array) {
                // Convert int arrays back to a normal number array
                let convertedValue: number[] = [];
    
                for(let i = 0; i < value.length; i++) {
                    convertedValue[i] = this.toUnsigned(value[i]);
                }
    
                value = convertedValue;
            }
    
            // If we get an array encode it to an SJCL word array
            if(Array.isArray(value))
                value = sjcl.codec.bytes.toBits(value);
    
            this.md1 = new sjcl.hash.sha1();
    
            this.md1.update(value);
    
            this.state = sjcl.codec.bytes.fromBits(this.md1.finalize());
        }
    
        private next(bits: number): number {
            let numBytes = Math.floor((bits + 7) / 8);
            let next = 0;
    
            let bytes = this.getRandomBytes(numBytes);
            for(let i = 0; i < numBytes; i++) {
                next = (next << 8) + (bytes[i] & 0xFF);
            }
    
            return next >>> (numBytes * 8 - bits);
        }
    
        nextSingle(): number {
            // Grab one byte and then divide it by its max value.
            // Effectively this will clamp the byte between 0 and 1.
            return this.toUnsigned(this.getRandomBytes(1)[0]) / 0xFF;
        }
    
        nextInt(bound: number): number {
            let r = this.next(31);
            let m = bound - 1;
    
            if((bound & m) == 0) {
                r = ((bound * r) >> 31);
            }
            else {
                for(let u = r; u - (r = u % bound) + m < 0; u = this.next(31)) {
                    // Do nothing
                }
            }
    
            return r;
        }
    
        getRandomBytes(count: number): Int8Array {
            let result = new Int8Array(count);
    
            let index: number = 0;
            let todo: number;
            let output = this.remainder;
    
            // Use remainder from last time
            let r: number = this.remCount;
            if (r > 0) {
                // How many bytes?
                todo = (result.length - index) < (this.DIGEST_SIZE - r) ?
                            (result.length - index) : (this.DIGEST_SIZE - r);
                // Copy the bytes, zero the buffer
                for (let i = 0; i < todo; i++) {
                    result[i] = output[r];
                    output[r++] = 0;
                }
                this.remCount += todo;
                index += todo;
            }
    
            // If we need more bytes, make them.
            while (index < result.length) {
                // Step the state
                this.md1.update(sjcl.codec.bytes.toBits(this.state));
                output = sjcl.codec.bytes.fromBits(this.md1.finalize());
                this.updateState(this.state, output);
    
                // How many bytes?
                todo = (result.length - index) > this.DIGEST_SIZE ?
                    this.DIGEST_SIZE : result.length - index;
                // Copy the bytes, zero the buffer
                for (let i = 0; i < todo; i++) {
                    result[index++] = output[i];
                    output[i] = 0;
                }
                this.remCount += todo;
            }
    
            // Store remainder for next time
            this.remainder = output;
            this.remCount %= this.DIGEST_SIZE;
    
            return result;
        }
    
        private updateState(state: Uint8Array, output: Uint8Array): void {
            let last: number = 1;
            let v: number;
            let t: number;
            let zf: boolean = false;
    
            // state(n + 1) = (state(n) + output(n) + 1) % 2^160;
            for (let i = 0; i < state.length; i++) {
                let stateByte = this.toSigned(state[i]);
                let outputByte = this.toSigned(output[i]);
    
                // Add two bytes
                v = stateByte + outputByte + last;
                // Result is lower 8 bits
                t = v & 0xFF;
                // Store result. Check for state collision.
                zf = zf || (stateByte != t);
                state[i] = this.toUnsigned(t);
                // High 8 bits are carry. Store for next iteration.
                last = v >> 8;
            }
    
            // Make sure at least one bit changes!
            if (!zf) {
               state[0]++;
    
               // Ensure state remains a byte value
               state[0] %= 0xFF;
            }
        }
    
        private toSigned(byte: number): number {
            return (byte > 0x7F) ? byte - 0x100 : byte;
            // return byte - 255;
            // return (new Int8Array([byte]))[0];
        }
        private toUnsigned(byte: number): number {
            return byte & 255;
            // return (new Uint8Array([byte]))[0];
        }
    }

    class LamportGenerator {
        private readonly CS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
        readonly publicKeys: string[];
        readonly seeds: Int8Array[];
        readonly count: number;
    
        private readonly md256: any;
        private readonly md512: any;
        private prng: SHA1PRNG;
    
        constructor(seeds: Int8Array[], count: number) {
            this.seeds = seeds;
            this.count = count;
    
            this.publicKeys = [];
            this.md256 = new sjcl.hash.sha256();
            this.md512 = new sjcl.hash.sha512();
        }
    
        fill(): void {
            for(let i = 0; i < this.count; i++) {
                let seed = this.seeds[i];
    
                // Prepare prng
                this.prng = new SHA1PRNG(seed);
    
                this.publicKeys.push(
                    this.sha256(this.getLamportPublicKey())
                );
            }
        }
    
        private getLamportPublicKey(): string {
            return this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
                   this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha512(this.getLamportPrivateKey()) + this.sha512(this.getLamportPrivateKey());
        }
    
        private getLamportPrivateKey(): string {
            let length = this.CS.length;
    
            return    this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                    + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                    + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                    + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)];
        }
    
        private sha256Short(data: string): string {
            return this.sha256(data).substr(0, 16);
        }
    
        private sha512(data: string): string {
            this.md512.update(sjcl.codec.utf8String.toBits(data));
    
            let output = this.md512.finalize();
    
            this.md512.reset();
    
            return sjcl.codec.base64.fromBits(output);
        }
    
        private sha256(data: string): string {
            this.md256.update(sjcl.codec.utf8String.toBits(data));
    
            let output = this.md256.finalize();
    
            this.md256.reset();
    
            return sjcl.codec.base64.fromBits(output);
        }
    }

    let lamportGenerator = new LamportGenerator(input.seeds, input.count);

    lamportGenerator.fill();

    done(
        {
            startIndex: input.startIndex,
            publicKeys: lamportGenerator.publicKeys
        }
    );
}

