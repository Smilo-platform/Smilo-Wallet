import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { IAddressService } from "../address-service/address-service";
import { MockAddressService } from "../../../test-config/mocks/MockAddressService";
import { IWalletService } from "../wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";

describe("TransactionSignService", () => {
    let service: TransactionSignService;
    let merkleTreeService: IMerkleTreeService;
    let addressService: IAddressService;
    let walletService: IWalletService;

    beforeEach(() => {
        // Construct service
        merkleTreeService = new MockMerkleTreeService();
        addressService = new MockAddressService();
        walletService = new MockWalletService();

        service = new TransactionSignService(<any>merkleTreeService, <any>addressService, <any>walletService);
    });

    
});