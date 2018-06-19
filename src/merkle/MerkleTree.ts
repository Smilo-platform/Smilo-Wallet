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
            pool.send(jobInput);
        }

        let processedJobOutputs: ILamportGeneratorThreadOutput[] = [];

        pool.on("done", (job, message: ILamportGeneratorThreadOutput) => {
            processedJobOutputs.push(message);
        });

        pool.on("error", (job, error) => {
            console.error(job);
            console.error(error);
        });

        pool.on("finished", () => {
            console.log("All jobs finished");
            pool.killAll();

            // Sort
            processedJobOutputs.sort((a, b) => a.startIndex - b.startIndex);

            // Concatenate
            let publicKeys = processedJobOutputs.reduce(
                (previous, current) => previous.concat(current.publicKeys),
                []
            );

            // We now have the final list of public keys
            console.log(publicKeys);
            let publicKeyEndTime = new Date();
            console.log(`Took ${ (publicKeyEndTime.getTime() - publicKeyStartTime.getTime()) / 1000 / 60}m`);
        })

        // let thread = spawn(LamportGeneratorThread);
        // thread.send(threadInput)
        //       .on("message", (publicKeys) => {
        //         console.log("Received message from thread!");

        //         console.log("Public keys");
        //         console.log(publicKeys);

        //         thread.kill();

        //         let publicKeyEndTime = new Date();
        //         console.log(`Took ${ (publicKeyEndTime.getTime() - publicKeyStartTime.getTime()) / 1000 / 60}m`);
        //       })
        //       .on("error", (error) => {
        //         console.error(error);
        //       })
        //       .on("exit", () => {
        //         console.log("Thread exited");
        //       });

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