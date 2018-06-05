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
});