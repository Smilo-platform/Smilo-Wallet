import { ITransaction } from "./ITransaction";

export interface ITransactionList {
    transactions: ITransaction[];
    skip: number;
    take: number;
    totalCount: number;
}