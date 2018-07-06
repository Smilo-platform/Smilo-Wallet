import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";
import { ITransaction } from "../../src/models/ITransaction";

export class MockWalletService implements IWalletService {

    getAll(): Promise<any> {
        return new Promise(resolve => {resolve([
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
                type : "local"}]
        )});
    }

    generateId(): string {
        return "SOME_ID";
    }

    store(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }

    remove(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }
}