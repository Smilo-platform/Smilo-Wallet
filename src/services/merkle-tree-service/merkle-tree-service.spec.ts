import { MerkleTreeService } from "./merkle-tree-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { Platform } from "ionic-angular/platform/platform";
import { Storage } from "@ionic/storage";

describe("MerkleTreeService", () => {
    let service: MerkleTreeService;

    let keyStoreService: MockKeyStoreService;
    let storageService: Storage;
    let platformService: Platform;

    beforeEach(() => {
        keyStoreService = new MockKeyStoreService();
        storageService = new Storage(null);
        platformService = new Platform();

        service = new MerkleTreeService(keyStoreService, storageService, platformService);
    });
    
});