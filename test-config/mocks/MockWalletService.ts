import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";
import { ITransaction } from "../../src/models/ITransaction";

export class MockWalletService implements IWalletService {

    getAll(): Promise<any> {
        return new Promise(resolve => {resolve([
            {"id":"012d294e-cb11-439b-937a-12d47a52c305",
                "type":"local",
                "name":"Biosta",
                "publicKey":
                "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
            {"id":"9b5329ff-c683-42a5-9165-4093e4076166",
                "type":"local",
                "name":"Labilo",
                "publicKey":"ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
            {"id":"a2e16167-fedb-47d2-8856-2b3f97389c35",
                "type":"local",
                "name":"Zalista",
                "publicKey":"EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"}]
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