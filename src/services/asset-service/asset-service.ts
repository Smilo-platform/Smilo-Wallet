import { Injectable } from "../../../node_modules/@angular/core";
import Big from "big.js";
import { IAsset } from "../../models/IAsset";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { UrlService } from "../url-service/url-service";

export interface IAssetService {
    prepareBigNumber(numberAsString: string, assetId: string): Promise<Big>;

    getAll(): Promise<IAsset[]>;

    get(assetId: string): Promise<IAsset>;
}

@Injectable()
export class AssetService implements IAssetService {
    constructor(private httpClient: HttpClient,
                private urlService: UrlService) {

    }

    /**
     * Prepares the given 'number' (stored as a string) for the given asset id.
     * 
     * This will return a Big number which can be used to accurately perform decimal calculations.
     */
    prepareBigNumber(numberAsString: string, assetId: string): Promise<Big> {
        return this.get(assetId).then(
            (asset) => {
                // Add the decimal point in the numberAsString variable
                numberAsString = this.insertDecimalDot(numberAsString, asset.decimals);

                return Big(numberAsString);
            }
        );
    }

    getAll(): Promise<IAsset[]> {
        return this.httpClient.get<IAsset[]>(
            `${ this.urlService.getBaseUrl() }/asset`
        ).toPromise();
    }

    get(assetId: string): Promise<IAsset> {
        return this.httpClient.get<IAsset>(
            `${ this.urlService.getBaseUrl() }/asset/${ assetId }`
        ).toPromise();
    }

    /**
     * Inserts a dot (e.g. '.') at the specified index in the given string.
     * The index is counted from the right and not from left.
     * @param numberAsString 
     * @param dotIndex 
     */
    private insertDecimalDot(numberAsString: string, dotIndex: number): string {
        // Pad string if too short
        numberAsString = this.padStringStart(numberAsString, "0", dotIndex);

        // Insert index
        return numberAsString.substr(0, numberAsString.length - dotIndex) + "." + numberAsString.substr(dotIndex);
    }

    /**
     * Pads the given string with the pad string until the target length has been reached or exceeded.
     * @param str 
     * @param pad 
     * @param targetLength 
     */
    private padStringStart(str: string, pad: string, targetLength: number): string {
        while(str.length < targetLength)
            str = pad + str;

        return str;
    }
}