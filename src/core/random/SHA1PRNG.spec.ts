import { SHA1PRNG } from "./SHA1PRNG";

interface SHA1PRNGTestVector {
    seed: string;
    tests: {
        byteCount: number;
        bytes: number[]
    }[];
}

describe("SHA1PRNG", () => {
    let prng: SHA1PRNG;

    let testVectors: SHA1PRNGTestVector[] = [
        {
            seed: "PRIVATE_STRING",
            tests: [
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                }
            ]
        },
        {
            seed: "SOME_SEED_VALUE",
            tests: [
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                }
            ]
        },
        {
            seed: "WHERE_DID_THE_MUSHROOM_GO",
            tests: [
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                },
                {
                    byteCount: 25,
                    bytes: []
                }
            ]
        }
    ];

    beforeEach(() => {
        prng = new SHA1PRNG();
    });

    it("should generate correct values", () => {
        for(let testVector of testVectors) {
            prng.setSeed(testVector.seed);

            for(let test of testVector.tests) {
                let bytes = prng.getRandomBytes(test.byteCount);

                for(let i = 0; i < bytes.length; i++) {
                    expect(bytes[0]).toBe(test.bytes[i]);
                }
            }
        }
    });
});