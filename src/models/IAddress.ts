export interface IAddress {
    publickey: string;
    contractBalanceMap: {[index: string]: number};
    signatureCount: number;
}