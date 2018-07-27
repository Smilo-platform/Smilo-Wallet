import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IKeyStoreService } from "../key-store-service/key-store-service";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { IAddressService } from "../address-service/address-service";
import { MockAddressService } from "../../../test-config/mocks/MockAddressService";
import { IWalletService } from "../wallet-service/wallet-service";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";

describe("TransactionSignService", () => {
    let service: TransactionSignService;
    let merkleTreeService: IMerkleTreeService;
    let keyStoreService: IKeyStoreService;
    let addressService: IAddressService;
    let walletService: IWalletService;

    beforeEach(() => {
        // Construct service
        merkleTreeService = new MockMerkleTreeService();
        keyStoreService = new MockKeyStoreService();
        addressService = new MockAddressService();
        walletService = new MockWalletService();

        service = new TransactionSignService(<any>merkleTreeService, keyStoreService, <any>addressService, <any>walletService);
    });

    
});