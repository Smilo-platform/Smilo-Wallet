import { SeededRandom } from "./SeededRandom";

describe("SeededRandom", () => {
    let prng: SeededRandom;

    beforeEach(() => {
        prng = new SeededRandom("Seed");
    });

    it("should return a correct single random value", () => {
        for(let i = 0; i < 1000; i++) {
            let rand = prng.next();
            expect(rand).toBeGreaterThanOrEqual(0);
            expect(rand).toBeLessThanOrEqual(1);
        }
    });

    it("should current a correct amount of random bytes", () => {
        let bytes = prng.getRandomBytes(100);

        expect(bytes.length).toBe(100);
    });
});