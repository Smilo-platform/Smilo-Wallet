import { LamportGeneratorThread, ILamportGeneratorThreadInput } from "./LamportGeneratorThread";

describe("LamportGeneratorThread", () => {
    it("call the callback function", () => {
        let input: ILamportGeneratorThreadInput = {
            startIndex: 1337,
            seeds: [
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ])
            ],
            count: 10
        };

        let callbackSpy = jasmine.createSpy("callback", () => {});

        LamportGeneratorThread(input, callbackSpy);

        expect(callbackSpy).toHaveBeenCalled();
    });
});