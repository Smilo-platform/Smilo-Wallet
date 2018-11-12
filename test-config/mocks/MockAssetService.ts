import { IAssetService } from "../../src/services/asset-service/asset-service";
import { IAsset } from "../../src/models/IAsset";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export class MockAssetService implements IAssetService {
    prepareBigNumber(numberAsString: string, assetId: string): Smilo.FixedBigNumber {
        return new Smilo.FixedBigNumber(0, 0);
    }

    getAll(): Promise<IAsset[]> {
        let assets: IAsset[] = [
            {
                address: "0x000000536d696c6f",
                totalSupply: 200000000,
                name: "Smilo",
                decimals: 0,
                symbol: "XSM"
            },
            {
                address: "0x536d696c6f506179",
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
