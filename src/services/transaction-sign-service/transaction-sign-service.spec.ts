import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IKeyStoreService } from "../key-store-service/key-store-service";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";

describe("TransactionSignService", () => {
    let service: TransactionSignService;
    let merkleTreeService: IMerkleTreeService;
    let keyStoreService: IKeyStoreService;

    beforeEach(() => {
        // Construct service
        merkleTreeService = new MockMerkleTreeService();
        keyStoreService = new MockKeyStoreService();

        service = new TransactionSignService(<any>merkleTreeService, keyStoreService);
    });

    
});