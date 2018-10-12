import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface ITransactionList {
    transactions: Smilo.ITransaction[];
    skip: number;
    take: number;
    totalCount: number;
}