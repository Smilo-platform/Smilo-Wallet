import { Injectable, isDevMode } from "@angular/core";

export interface IUrlService {
    getBaseUrl(): string
}

@Injectable()
export class UrlService implements IUrlService {
    readonly productionBaseUrl: string = "http://api.smilo.network:8080";
    readonly developmentBaseUrl: string = "http://api.smilo.network:8080";

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