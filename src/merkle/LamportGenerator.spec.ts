import { LamportGeneratorThread, ILamportGeneratorThreadInput } from "./LamportGenerator";

describe("LamportGenerator", () => {
    it("should return the correct amount of public keys", () => {
        let input: ILamportGeneratorThreadInput = {
            startIndex: 1337,
            seeds: [
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Uint8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ])
            ],
            count: 10
        };

        LamportGeneratorThread(input, (output) => {
            expect(output.startIndex).toBe(1337);
            expect(output.publicKeys.length).toBe(10);
            output.publicKeys.forEach((key) => expect(key).toBeDefined());
        });
    });
});