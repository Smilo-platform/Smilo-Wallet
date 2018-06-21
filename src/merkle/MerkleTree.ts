declare const forge: any;
declare const sjcl: any;
import "seedrandom";
import { LamportGeneratorThread, ILamportGeneratorThreadInput, ILamportGeneratorThreadOutput } from "./LamportGenerator";
import { spawn, Pool } from "threads";

// declare const threads: any;

export class MerkleTree {
    private static readonly KEYS_PER_THREAD = 100;

    
    // Constructor hidden to force the user to construct this object using static functions.
    private constructor() {

    }

    static generate(privateKey: string, layerCount: number): Promise<MerkleTree> {
        let prng = new (<any>Math).seedrandom(privateKey);

        let totalKeys = Math.pow(2, layerCount - 1);

        console.log("Start generating public keys");
        let publicKeyStartTime = new Date();

        // let testPool = new Pool();
        // testPool.run(((input: any, done: (result: number) => void) => {
        //     setTimeout(() => {
        //         done(input.value * 2);
        //     }, 10);
        // }));

        // for(let i = 0; i < 10000; i++) {
        //     let dummyData: Uint8Array[] = [];
        //     for(let j = 0; j < 100; j++) {
        //         dummyData.push(MerkleTree.getRandomBytes(prng, 100));
        //     }
        //     testPool.send({
        //         some: "object",
        //         arr: dummyData,
        //         value: i
        //     });
        // }

        // testPool.on("done", (job, output: number) => {
        //     console.log("Done: ", output);
        // });

        // testPool.on("error", (error) => {
        //     console.error(error);
        // });

        // testPool.on("finished", () => {
        //     console.log("finished");
        //     testPool.killAll();
        // });

        // Create a thread pool
        let pool = new Pool();
        pool.run(LamportGeneratorThread);

        // Enqueue jobs for the thread pool
        for(let i = 0; i < totalKeys; i += MerkleTree.KEYS_PER_THREAD) {
            // Determine how many keys are still left to be generated
            let keysThisIteration = Math.min(MerkleTree.KEYS_PER_THREAD, totalKeys - i);

            // Generate seeds
            let seeds: Uint8Array[] = [];
            for(let j = 0; j < keysThisIteration; j++) {
                seeds.push(MerkleTree.getRandomBytes(prng, 100));
            }

            // Prepare job input
            let jobInput: ILamportGeneratorThreadInput = {
                startIndex: i,
                baseUrl: `${ window.location.protocol }//${ window.location.host }`,
                seeds: seeds,
                count: keysThisIteration
            };

            // Send to job queue
            pool.queueJob(pool.send(jobInput));
        }

        // Store job output here. Later we will concatenate it.
        let processedJobOutputs: ILamportGeneratorThreadOutput[] = [];

        pool.on("done", (job, message: ILamportGeneratorThreadOutput) => {
            // Store job output without processing it any further at this point
            processedJobOutputs.push(message);
        });

        pool.on("error", (job, error) => {
            // A job failed, this means the entire Merkle Tree is worthless.
            // Abort and notify calling function about the failure...
            console.error(job);
            console.error(error);

            pool.killAll();
        });

        pool.on("finished", () => {
            console.log("All jobs finished");
            pool.killAll();

            // Sort job outputs so public keys are in order
            processedJobOutputs.sort((a, b) => a.startIndex - b.startIndex);

            // Concatenate
            let publicKeys = processedJobOutputs.reduce<string[]>(
                (previous, current) => previous.concat(current.publicKeys),
                []
            );

            // We now have the final list of public keys
            console.log(publicKeys);
            let publicKeyEndTime = new Date();
            console.log(`Took ${ (publicKeyEndTime.getTime() - publicKeyStartTime.getTime()) / 1000 / 60}m`);
        });

        return Promise.resolve(new MerkleTree());
    }

    private static getRandomBytes(prng: any, count: number): Uint8Array {
        let randomBytes = new Uint8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(prng() * 0xFF);
        }

        return randomBytes;
    }
}