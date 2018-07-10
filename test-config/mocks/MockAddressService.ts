import { IAddressService, IAddressValidationResult } from "../../src/services/address-service/address-service";

export class MockAddressService implements IAddressService {
    addressFromPublicKey(publicKey: string, layerCount: number): string {
        throw new Error("Method not implemented.");
    }    

    isValidAddress(address: string): IAddressValidationResult {
        throw new Error("Method not implemented.");
    }

    getLayerCount(address: string): number {
        throw new Error("Method not implemented.");
    }
}