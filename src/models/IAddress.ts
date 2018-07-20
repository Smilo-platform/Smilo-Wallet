export interface IAddress {
    publickey: string;
    balances: {[index: string]: number};
    signatureCount: number;
}