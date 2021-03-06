import { Injectable, isDevMode } from "@angular/core";

export interface IUrlService {
    getBaseUrl(): string
}

@Injectable()
export class UrlService implements IUrlService {
    readonly productionBaseUrl: string = "https://prototype-api.smilo.network";
    readonly developmentBaseUrl: string = "http://localhost:8090";

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