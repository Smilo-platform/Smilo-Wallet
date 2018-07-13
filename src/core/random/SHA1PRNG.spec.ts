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
            seed: "PRIVATE_KEY",
            tests: [
                {
                    byteCount: 25,
                    bytes: [
                        -51, -126, -117, -75, -31, 
                        -11, 126, 94, 109, -118, 
                        -126, -97, 0, 34, 84, 
                        76, 49, 21, -27, -26, 
                        0, 26, -85, -81, 59
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        125, 105, -53, -51, -90, 
                        -59, -41, -118, 18, 97, 
                        -36, -87, 27, 69, -41, 
                        -19, 3, -58, -122, 93, 
                        10, 26, -88, -51, 40
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        -108, 108, -24, 12, -126, 
                        88, -25, -14, 44, -31, 
                        -128, -33, -96, -124, -78, 
                        -1, 78, 111, -74, 108, 
                        -20, 3, 16, -78, 79
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        67, 91, 121, -68, -4, 
                        -8, 56, 122, 24, -68, 
                        29, 82, 84, -84, -65, 
                        127, -112, 60, 92, -57, 
                        -108, -120, -31, 42, 45
                    ]
                }
            ]
        },
        {
            seed: "SOME_SEED_VALUE",
            tests: [
                {
                    byteCount: 25,
                    bytes: [
                        9, -110, -82, -116, -108, 
                        -36, -119, -54, 56, 90, 
                        45, 62, -103, -15, 117, 
                        68, -37, 84, -87, 54, 
                        -37, -55, 64, -56, -27
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        54, 111, -91, 109, 12, 
                        11, -74, 103, -94, -61, 
                        15, 54, 41, -48, -123, 
                        120, 95, -1, -122, -21, 
                        -2, -48, -106, -59, 81
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        -68, 119, 16, -40, 100, 
                        45, -8, 31, -97, 21, 
                        -69, -97, -128, -43, -112, 
                        -118, -60, 48, 40, -62, 
                        45, -50, -4, -95, 71
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        -46, 2, 11, -100, -116, 
                        16, -20, 45, -71, -115, 
                        114, -100, 57, 47, 13, 
                        -102, -14, -54, 101, -25, 
                        19, 39, 107, -99, -94
                    ]
                }
            ]
        },
        {
            seed: "WHERE_DID_THE_MUSHROOM_GO",
            tests: [
                {
                    byteCount: 25,
                    bytes: [
                        114, 95, -119, -15, 71, 
                        -1, 95, -59, -67, 56, 
                        -59, -38, -125, 0, -69, 
                        -78, 19, -29, 101, 69, 
                        -21, 55, -92, -120, 55
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        56, -21, 105, -88, -43, 
                        -123, 48, -69, -80, 16, 
                        -109, -116, 11, 99, 45, 
                        74, 122, 17, -20, -82, 
                        108, 7, -45, 48, -35
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        100, -127, 68, -64, -19, 
                        -96, -23, 20, -127, 9, 
                        -15, -49, -36, -47, 45, 
                        -124, -47, 47, -7, 109, 
                        -116, -47, -125, -90, 28
                    ]
                },
                {
                    byteCount: 25,
                    bytes: [
                        -40, -18, -5, -75, -18, 
                        52, -19, -47, 60, -26, 
                        102, 29, -54, -75, -105, 
                        -74, -61, 41, 96, -63, 
                        42, -48, -46, -20, 116
                    ]
                }
            ]
        }
    ];

    beforeEach(() => {
        prng = new SHA1PRNG();
    });

    it("should generate correct values when using a string as seed", () => {
        for(let testVector of testVectors) {
            prng.setSeed(testVector.seed);

            for(let test of testVector.tests) {
                let bytes = prng.getRandomBytes(test.byteCount);

                for(let i = 0; i < bytes.length; i++) {
                    expect(bytes[i]).toBe(test.bytes[i]);
                }
            }
        }
    });

    it("should generate correctly values when using a byte array as seed", () => {
        function toByteArray(str: string): number[] {
            let bytes: number[] = [];

            for(let i = 0; i < str.length; i++) {
                bytes.push(str.charCodeAt(i));
            }

            return bytes;
        }

        for(let testVector of testVectors) {
            prng.setSeed(toByteArray(testVector.seed));

            for(let test of testVector.tests) {
                let bytes = prng.getRandomBytes(test.byteCount);

                for(let i = 0; i < bytes.length; i++) {
                    expect(bytes[i]).toBe(test.bytes[i]);
                }
            }
        }
    });
});