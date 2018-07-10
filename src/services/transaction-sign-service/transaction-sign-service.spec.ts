import { TransactionSignService } from "./transaction-sign-service";
import { IMerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IKeyStoreService } from "../key-store-service/key-store-service";
import { IAddressService } from "../address-service/address-service";
import { MerkleTree } from "../../merkle/MerkleTree";
import { MockAddressService } from "../../../test-config/mocks/MockAddressService";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";

describe("TransactionSignService", () => {
    let service: TransactionSignService;
    let merkleTreeService: IMerkleTreeService;
    let keyStoreService: IKeyStoreService;
    let addressService: IAddressService;
    let merkleTree: MerkleTree;
    let sjcl: any;

    beforeEach(() => {
        // Construct service
        merkleTreeService = new MockMerkleTreeService();
        keyStoreService = new MockKeyStoreService();
        addressService = new MockAddressService();

        service = new TransactionSignService(merkleTreeService, keyStoreService, addressService);
    });

    beforeEach(() => {
        let md256 = new sjcl.hash.sha256();
        function sha256(data: string): string {
            md256.update(data, "utf8");

            let hash = md256.finalize();

            md256.reset();

            return sjcl.codec.base64.fromBits(hash);
        }

        // Construct Merkle Tree
        let merkleTreeLayers: string[][] = [];

        merkleTreeLayers[0] = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
        ];

        merkleTreeLayers[1] = [
            sha256(merkleTreeLayers[0][0] + merkleTreeLayers[0][1]),
            sha256(merkleTreeLayers[0][2] + merkleTreeLayers[0][3]),
            sha256(merkleTreeLayers[0][4] + merkleTreeLayers[0][5]),
            sha256(merkleTreeLayers[0][6] + merkleTreeLayers[0][7]),
        ];

        merkleTreeLayers[2] = [
            sha256(merkleTreeLayers[1][0] + merkleTreeLayers[1][1]),
            sha256(merkleTreeLayers[1][2] + merkleTreeLayers[1][3])
        ];

        merkleTreeLayers[3] = [
            sha256(merkleTreeLayers[2][0] + merkleTreeLayers[2][1])
        ];

        merkleTree = new (<any>MerkleTree)(merkleTreeLayers);
    });
});