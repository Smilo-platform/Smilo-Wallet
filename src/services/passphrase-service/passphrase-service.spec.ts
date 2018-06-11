import { PassphraseService } from "./passphrase-service";

describe("PassphraseService", () => {
    let service: PassphraseService;

    beforeEach(() => {
        service = new PassphraseService();
    });

    it("should generate the correct amount of words", () => {
        expect(service.generate(10).length).toEqual(10);
        expect(service.generate(20).length).toEqual(20);
        expect(service.generate(30).length).toEqual(30);
    });

    it("should turn a passphrase into a string array correctly", () => {
        expect(service.passphraseStringToWords("one two three")).toEqual(
            ["one", "two", "three"]
        );

        expect(service.passphraseStringToWords("1 2 3")).toEqual(
            ["1", "2", "3"]
        );

        expect(service.passphraseStringToWords("one   two   three")).toEqual(
            ["one", "two", "three"]
        );

        expect(service.passphraseStringToWords("       ")).toEqual([]);

        expect(service.passphraseStringToWords("")).toEqual([]);
    });

    it("should validate a passphrase correctly", () => {
        let passphraseToWordsReturnValue = ["one", "two", "three"];
        spyOn(service, "passphraseStringToWords").and.returnValue(passphraseToWordsReturnValue);

        expect(service.isValid("one two three", 3)).toBeTruthy();

        expect(service.isValid("one two three", 4)).toBeFalsy();
    });
});