import { Injectable, isDevMode } from "@angular/core";

export interface IUrlService {
    getBaseUrl(): string
}

@Injectable()
export class UrlService implements IUrlService {
    private productionBaseUrl: string = "http://api.smilo.network:8080";
    private developmentBaseUrl: string = "http://api.smilo.network:8080";

    constructor() {
        
    }

    getBaseUrl(): string {
        if(isDevMode()) {
            return this.developmentBaseUrl;
        }
        else {
            return this.productionBaseUrl;
        }
    }
}