import * as Smilo from "@smilo-platform/smilo-commons-js-web"

export interface IAddress {
    publickey: string;
    balances: {[index: string]: Smilo.FixedBigNumber};
    signatureCount: number;
}