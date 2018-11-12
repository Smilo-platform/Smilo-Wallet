import { IWalletTransactionHistoryService } from "../../src/services/wallet-transaction-history-service/wallet-transaction-history-service";
import { ITransactionList } from "../../src/models/ITransactionList";

export class MockWalletTransactionHistoryService implements IWalletTransactionHistoryService {

    getTransactionHistory(publicKey: string): Promise<ITransactionList> {
        let transactionList: ITransactionList = {
            transactions: <any>[
                { "date": "Jun 14, 2018 18:01:44 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "17srYd7sVwKgE5ha7ZXSBxUACjm2hMVQeH", "amount": "55", "assetId": "0x000000536d696c6f"},
                { "date": "Jun 13, 2018 19:14:34 PM", "input": "1KkPiyNvRHsWC67KgK6AFHMWoxmcGm5d1H", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "292", "assetId": "0x536d696c6f506179"},
                { "date": "Jun 08, 2018 15:44:36 PM", "input": "1LtqTERxw4QFLCbfLgB43P1XGAWUNmk6DA", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "122", "assetId": "0x000000536d696c6f"},
                { "date": "May 28, 2018 17:22:53 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "1AvAvNh6PjzN9jjhUNhT5DuzMPgnhM6R2u", "amount": "254", "assetId": "0x000000536d696c6f"},
                { "date": "May 26, 2018 23:44:51 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "13QMZULQGBodKzsAF462Dh2opf8PQawYBt", "amount": "5192", "assetId": "0x536d696c6f506179"},
            ],
            skip: 0,
            take: 32,
            totalCount: 5
        };

        return Promise.resolve(transactionList);
    }
}
