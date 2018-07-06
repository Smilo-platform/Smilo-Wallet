import { WalletService, WALLET_STORAGE_KEY } from "./wallet-service";
import { MockStorage } from "../../../test-config/mocks/MockStorage";
import { MockMerkleTreeService } from "../../../test-config/mocks/MockMerkleTreeService";
import { MockWalletService } from "../../../test-config/mocks/MockWalletService";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { IWallet } from "../../models/IWallet";
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { ILocalWallet } from "../../models/ILocalWallet";

describe("WalletService", () => {
    let walletService: WalletService;
    let storage: MockStorage;
    let merkleTreeService: MockMerkleTreeService;
    let mockedWalletService: MockWalletService;

    beforeEach(() => {
        storage = new MockStorage();
        merkleTreeService = new MockMerkleTreeService();
        mockedWalletService = new MockWalletService();
        walletService = new WalletService(storage, <MerkleTreeService>merkleTreeService);
    });

    it("should return an empty array when there are no wallets saved", (done) => {
        spyOn(storage, "get").and.returnValue(Promise.resolve());
        walletService.getAll().then(data => {
            expect(storage.get).toHaveBeenCalledWith(WALLET_STORAGE_KEY);
            expect(data).toEqual([]);
            done();
        });
    });

    it("should return three specific wallets when retrieving the wallets from storage", (done) => {
        mockedWalletService.getAll().then(data => {
            spyOn(storage, "get").and.returnValue(Promise.resolve(data));
            walletService.getAll().then(data => {
                expect(data).toEqual(<any>[
                    {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
                        keyStore: { 
                            cipher: "AES-CTR",
                            cipherParams: {
                                iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                            },
                            cipherText : "JIH", 
                            controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                            keyParams: {
                                iterations: 128,
                                keySize: 32,
                                salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                            },
                        },
                        lastUpdateTime: null,
                        name: "Hosha",
                        publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
                        type : "local"},
                    {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
                        keyStore: { 
                            cipher: "AES-CTR",
                            cipherParams: {
                                iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                            },
                            cipherText : "JIH", 
                            controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                            keyParams: {
                                iterations: 128,
                                keySize: 32,
                                salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                            },
                        },
                        lastUpdateTime: null,
                        name: "Bosha",
                        publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
                        type : "local"},
                    {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
                        keyStore: { 
                            cipher: "AES-CTR",
                            cipherParams: {
                                iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                            },
                            cipherText : "JIH", 
                            controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                            keyParams: {
                                iterations: 128,
                                keySize: 32,
                                salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                            },
                        },
                        lastUpdateTime: null,
                        name: "Losha",
                        publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
                        type : "local"}]);
                done();
            });
        });
    });

    it("should return cached wallets when there are already existing wallets", () => {
        spyOn(storage, "get").and.callThrough();
        let wallets = [
            {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Bosha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"}];
        (<any>walletService).wallets = wallets;
        walletService.getAll().then(data => {
            expect(data).toEqual(<any>wallets);

            expect(data).not.toBe(<any>wallets);
        });
        expect(storage.get).not.toHaveBeenCalled();
    });

    it("should push a new wallet when it does not yet exist and overwrite when it already exists", (done) => {
        expect((<any>walletService).wallets).toEqual([]);
        spyOn(storage, "set").and.callThrough();
        let wallet: ILocalWallet = {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Bosha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"};
        // Try store new wallet
        walletService.store(wallet).then(data => {
            expect((<any>walletService).wallets).toEqual([wallet]);
            // Saved to storage
            expect(storage.set).toHaveBeenCalled();
            // After the first wallet is saved try to save the same wallet again
            walletService.store(wallet).then(data => {
                // So this time it shouldn't be pushed again
                expect((<any>walletService).wallets).toEqual([wallet]);
                // Saved to storage
                expect(storage.set).toHaveBeenCalled();
                done();
            });
        });
    });

    it("should return undefined because the wallet does not exist", (done) => {
        walletService.remove(null).then(data => {
            expect(data).toBeUndefined();
            done();
        });
    });

    it("should remove the wallet from the list and merkletree if it exists", (done) => {
        spyOn(merkleTreeService, "remove");
        spyOn(storage, "set");
        expect((<any>walletService).wallets).toEqual([]);
        let wallet: ILocalWallet = {id : "4b6cff11-5888-43bb-bde1-911e12b659e6",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "Bosha",
            publicKey : "S5NEKHPKXS7F75IVKGVS4A56U4FF6VM5U4YF64",
            type : "local"};
        (<any>walletService).wallets.push(wallet);
        expect((<any>walletService).wallets.length).toBe(1);
        let fakeWallet: ILocalWallet = {id : "NOT_EXISTING",
            keyStore: { 
                cipher: "AES-CTR",
                cipherParams: {
                    iv: "a/ÿûÅ)rêYgÅ.¾DÖwW;6×aqr"
                },
                cipherText : "JIH", 
                controlHash : "e845922979b1fad26a716ac155a4cbb822c6538561d7e575206190e87200d4c7",
                keyParams: {
                    iterations: 128,
                    keySize: 32,
                    salt: "G'G&ÃµÈ¶qvÍO£M3ý`~põqög` ↵¯4\¤BùøÃ{!êjô\Ý ½ÎêN«Î¥^²Ôô`LEK_0{×ôºæç¯FÉdÒ`6ÉSîK¬D¡Ün Û¡c¸Éz↵ë*P$}Lò?%±à$Ù¿BëÒ<@dT3'ê Xï¡ cÿÑÎÉ~5¶÷ûS@ù/¡ö+°¿BCÍêüf↵ÑÃ&öêX](<ä=AósµcU£éÒÀæÿ:¡íÓN+¹Py`ÿÈË5H1ÑRï¼" 
                },
            },
            lastUpdateTime: null,
            name: "name",
            publicKey : "NOT_EXISTING",
            type : "local"};
        walletService.remove(fakeWallet).then(data => {
            expect((<any>walletService).wallets).toEqual([wallet]);
            expect(storage.set).not.toHaveBeenCalled();
            expect(merkleTreeService.remove).not.toHaveBeenCalled();
            expect((<any>walletService).wallets.length).toBe(1);
            walletService.remove(wallet).then(data => {
                expect((<any>walletService).wallets).toEqual([]);
                expect(storage.set).toHaveBeenCalled();
                expect(merkleTreeService.remove).toHaveBeenCalledWith(wallet);
                expect((<any>walletService).wallets.length).toBe(0);
                done();
            });
        });
    });

    it("should return a generated ID with length 36 and 4 dashes every x characters", () => {
        let id1 = walletService.generateId();
        let id2 = walletService.generateId();
        let id3 = walletService.generateId();
        expect(validateId(id1)).toBeTruthy();
        expect(validateId(id2)).toBeTruthy();
        expect(validateId(id3)).toBeTruthy();
    });

    function validateId(id: string): boolean {
        var regexp = /^[a-zA-Z0-9-]+$/;
        return id.length === 36 && 
               id.substring(8,9) === "-" && 
               id.substring(13,14) === "-" && 
               id.substring(18,19) === "-" &&
               id.substring(23,24) === "-" &&
               id.search(regexp) !== -1;
    }
});