import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface ITransactionList {
    content: Smilo.ITransaction[];
    skip: number;
    take: number;
    totalCount: number;
}