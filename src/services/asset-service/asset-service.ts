import { Injectable } from "../../../node_modules/@angular/core";
import Big from "big.js";
import { IAsset } from "../../models/IAsset";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { BigNumberHelper } from "../../core/big-number/BigNumberHelper";

export interface IAssetService {
    prepareBigNumber(numberAsString: string, assetId: string): Big;
    toBigIntegerString(number: Big, assetId: string): string;

    getAll(): Promise<IAsset[]>;

    get(assetId: string): Promise<IAsset>;
}

@Injectable()
export class AssetService implements IAssetService {
    private assetMap: Map<String, IAsset>;
    private bigNumberHelper = new BigNumberHelper();

    constructor(private httpClient: HttpClient,
                private urlService: UrlService) {

    }

    private ensureAssetCache() {
        if(!this.assetMap)
            throw new Error("Asset cache not initialized. Make sure you call 'getAll' first");
    }

    private cacheAssets(assets: IAsset[]) {
        this.assetMap = new Map<String, IAsset>();

        for(let asset of assets) {
            this.assetMap.set(asset.name, asset);
        }
    }

    /**
     * Prepares the given 'number' (stored as a string) for the given asset id.
     * 
     * This will return a Big number which can be used to accurately perform decimal calculations.
     */
    prepareBigNumber(numberAsString: string, assetId: string): Big {
        this.ensureAssetCache();

        let asset = this.assetMap.get(assetId);
        
        return this.bigNumberHelper.prepareBigNumber(numberAsString, asset.decimals);
    }

    /**
     * Converts the given Big number into a string symbolizing a Big Integer.
     */
    toBigIntegerString(number: Big, assetId: string): string {
        this.ensureAssetCache();

        let asset = this.assetMap.get(assetId);

        return this.bigNumberHelper.toBigIntegerString(number, asset.decimals);
    }

    getAll(): Promise<IAsset[]> {
        return this.httpClient.get<IAsset[]>(
            `${ this.urlService.getBaseUrl() }/asset`
        ).toPromise().then(
            (assets) => {
                this.cacheAssets(assets);

                return assets;
            }
        );
    }

    get(assetId: string): Promise<IAsset> {
        return this.httpClient.get<IAsset>(
            `${ this.urlService.getBaseUrl() }/asset/${ assetId }`
        ).toPromise();
    }
}