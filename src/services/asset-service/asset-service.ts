import { Injectable } from "../../../node_modules/@angular/core";
import { IAsset } from "../../models/IAsset";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { UrlService } from "../url-service/url-service";
import { FixedBigNumber } from "../../core/big-number/FixedBigNumber";

export interface IAssetService {
    prepareBigNumber(numberAsString: string, assetId: string): FixedBigNumber;

    getAll(): Promise<IAsset[]>;

    get(assetId: string): Promise<IAsset>;
}

@Injectable()
export class AssetService implements IAssetService {
    private assetMap: Map<String, IAsset>;

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
            this.assetMap.set(asset.address, asset);
        }
    }

    /**
     * Prepares the given 'number' (stored as a string) for the given asset id.
     * 
     * This will return a Big number which can be used to accurately perform decimal calculations.
     */
    prepareBigNumber(number: string|FixedBigNumber, assetId: string): FixedBigNumber {
        if(number instanceof FixedBigNumber)
            return number;

        this.ensureAssetCache();

        let asset = this.assetMap.get(assetId);

        return FixedBigNumber.fromBigIntegerString(number, asset.decimals);
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