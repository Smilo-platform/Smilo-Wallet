import { IAddressService } from "../../src/services/address-service/address-service";
import { IAddress } from "../../src/models/IAddress";

export class MockAddressService implements IAddressService {
    get(address: string): Promise<IAddress> {
        return Promise.resolve(null);
    }
}