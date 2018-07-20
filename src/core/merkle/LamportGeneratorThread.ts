// We have to import the LamportGenerator in a special way!
// Because the below LamportGeneratorThread is actually executed as a webworker
// it won't really have access to the LamportGenerator we imported here.
// Instead a javascript file will be imported by the webworker containing the LamportGenerator implementation.
// Now if we would just say `import { LamportGenerator } from "../random/LamportGenerator"` Typescript/Webpack would
// internally rename the LamportGenerator library to something like `WEBPACK___BLABLABLA_SHA1PRNG` which obviously
// is not the name of the LamportGenerator script the webworker will import.
// Using this simple trick we enforce the class name LamportGenerator stays LamportGenerator.
import * as lamport from "./LamportGenerator";
const LamportGenerator = lamport.LamportGenerator;

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
    let lamportGenerator = new LamportGenerator(input.seeds, input.count);

    lamportGenerator.fill();

    done(
        {
            startIndex: input.startIndex,
            publicKeys: lamportGenerator.publicKeys
        }
    );
}

