import { Injectable, isDevMode } from "@angular/core";

export interface IUrlService {
    getBaseUrl(): string
}

@Injectable()
export class UrlService implements IUrlService {
    readonly productionBaseUrl: string = "https://prototype-api.smilo.network";
    readonly developmentBaseUrl: string = "https://quakechain.smilo.network";
    // readonly developmentBaseUrl: string = "http://localhost:8085";

    constructor() {}

    getBaseUrl(): string {
        if (this.isDevelopment()) {
            return this.developmentBaseUrl;
        } else {
            return this.productionBaseUrl;
        }
    }

    isDevelopment(): boolean {
        return isDevMode();
    }
}
