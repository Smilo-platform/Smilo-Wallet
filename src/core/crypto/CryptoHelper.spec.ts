import { CryptoHelper } from "./CryptoHelper";

declare const sjcl: any;

describe("CryptoHelper", () => {
    let cryptoHelper: CryptoHelper;

    beforeEach(() => {
        cryptoHelper = new CryptoHelper();
    });

    it("should compute sha512 hash correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "NieQminDE4Ggcewn98nKl3Jhgq7Smn3dLlQ1MyLPswq7njpt8qwsIP4jQ2MR1nhWTQyNMFkwV19g4tPQSBhNeQ=="
            },
            {
                data: "Hello World",
                output: "LHT9F+2v2A6ER7DUZ0HuJDt+t03SFJoKsbkkb7MDgvJ+hT2FhXGeDmfL2g2qj1FnEGRhXWRa4nrLFb+xRH9Fmw=="
            },
            {
                data: "Bla Bla Bla",
                output: "j9VPHxd/AFBxhUidXmyEySlIZg6RB2KHwiFqzCaMNhmclUGJa6OzmbTOLT7MDI/J+womhR1cNd3YYklWR8SHjg=="
            },
            {
                data: "Some words are longer than other words!",
                output: "JPc+bBv4u27eTp3ZrgPhiEYAFS+lWRd9HFaKiFTTQxK+s+wlQu2s41zbSVKGI4+xAfBf25IA3TtPXVLBTPuvrA=="
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha512(test.data)).toBe(test.output);
        }
    });

    it("should compute sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U="
            },
            {
                data: "Hello World",
                output: "pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4="
            },
            {
                data: "Bla Bla Bla",
                output: "CpvENCjEtiRJM7Ah41B3Jw/NLp3uuSyCKlN4jjv/oo8="
            },
            {
                data: "Some words are longer than other words!",
                output: "KC9NzYqIPavRl8iDx9/I/sZDUUwLl2RrNN4fK8KHwIA="
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256(test.data)).toBe(test.output);
        }
    });

    it("should compute short sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "WZRHGrsBESr8wYFZ"
            },
            {
                data: "Hello World",
                output: "pZGm1Av0IEBKARcz"
            },
            {
                data: "Bla Bla Bla",
                output: "CpvENCjEtiRJM7Ah"
            },
            {
                data: "Some words are longer than other words!",
                output: "KC9NzYqIPavRl8iD"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Short(test.data)).toBe(test.output);
        }
    });

    it("should compute binary sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "10110011001010010001111101010111011110001101010111111001100000110000001101100111110110110011001110100101101001111010110001101110011001100011011011010101100110110011110010101111010110101001110000011110011110010101100111111000101"
            },
            {
                data: "Hello World",
                output: "10100101100100011010011011010100101111110100100000100000010010101101111100111100111110110111101100011001000011010110101100110010110111111101111001101101000111010111010111101100101110111110110011010110110011111101001101110"
            },
            {
                data: "Bla Bla Bla",
                output: "1010100110111100010011010010100011000100101101101001001001001110011101100001000011110001110100001110111100111111111001101101110100111011110111010111001101100100000101010101010011111100010001110111011111111111010001010001111"
            },
            {
                data: "Some words are longer than other words!",
                output: "10100010111110011011100110110001010100010001111011010101111010001100101111100100010000011110001111101111111001000111111101100011010000111010001100110010111001011111001001101011110100110111101111110101111000010100001111100000010000000"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Binary(test.data)).toBe(test.output);
        }
    });

    it("should compute hexadecimal sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"
            },
            {
                data: "Hello World",
                output: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
            },
            {
                data: "Bla Bla Bla",
                output: "0a9bc43428c4b6244933b021e35077270fcd2e9deeb92c822a53788e3bffa28f"
            },
            {
                data: "Some words are longer than other words!",
                output: "282f4dcd8a883dabd197c883c7dfc8fec643514c0b97646b34de1f2bc287c080"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Hex(test.data)).toBe(test.output);
        }
    });

    it("should return base32 sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "LGKEOGV3AEISV7GBQFM7NTDUWT2RDOMY"
            },
            {
                data: "Hello World",
                output: "UWI2NVAL6QQEASQBC4Z47N5RSDLCYZN7"
            },
            {
                data: "Bla Bla Bla",
                output: "BKN4INBIYS3CISJTWAQ6GUDXE4H42LU5"
            },
            {
                data: "Some words are longer than other words!",
                output: "FAXU3TMKRA62XUMXZCB4PX6I73DEGUKM"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Base32Short(test.data)).toBe(test.output);
        }
    });
    
    it("should set isInitialized to true if it hasn't been initialized yet", () => {
        spyOn(cryptoHelper, <any>"initialize").and.callThrough();
        spyOn(sjcl.codec.base64, "fromBits");
        spyOn(sjcl.codec.bytes, "fromBits").and.returnValue("");
        (<any>cryptoHelper).md512 = {
            update() {},
            finalize() {},
            reset() {}
        };
        (<any>cryptoHelper).md256 = {
            update() {},
            finalize() {},
            reset() {}
        };

        cryptoHelper.sha512("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Binary("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Hex("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Base32Short("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();
    });
});