import { IAssetService } from "../../src/services/asset-service/asset-service";
import { FixedBigNumber } from "../../src/core/big-number/FixedBigNumber";
import { IAsset } from "../../src/models/IAsset";

export class MockAssetService implements IAssetService {
    prepareBigNumber(numberAsString: string, assetId: string): FixedBigNumber {
        return new FixedBigNumber(0, 0);
    }

    getAll(): Promise<IAsset[]> {
        let assets: IAsset[] = [
            {
                address: "000x00123",
                totalSupply: 200000000,
                name: "Smilo",
                decimals: 0,
                symbol: "XSM"
            },
            {
                address: "000x00321",
                totalSupply: 200000000,
                name: "SmiloPay",
                decimals: 18,
                symbol: "XSP"
            }
        ];

        return Promise.resolve(assets);
    }

    get(assetId: string): Promise<IAsset> {
        let asset: IAsset = {
            address: assetId,
            totalSupply: 1000,
            name: "SomeToken",
            decimals: 10,
            symbol: "ST"
        };

        return Promise.resolve(asset);
    }
}