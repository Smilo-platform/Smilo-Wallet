import { BIP32Service } from "./bip32-service";

describe("BIP32Service", () => {
    let service: BIP32Service;

    beforeEach(() => {
        service = new BIP32Service();
    });

    it("should call bitcoinjs correctly", () => {
        // We can only access the global library 'bitcoinjs' through the window object.
        let bitcoinjs = (<any>window).bitcoinjs;

        spyOn(bitcoinjs, "getPrivateKeyFromSeed").and.returnValue("PRIVATE_KEY");

        let result = service.getPrivateKey("SEED", 10);

        expect(result).toBe("PRIVATE_KEY");
        expect(bitcoinjs.getPrivateKeyFromSeed).toHaveBeenCalledWith("SEED", 10);
    });
});