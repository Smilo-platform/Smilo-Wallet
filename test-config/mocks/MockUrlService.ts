import { UrlService } from "../../src/services/url-service/url-service";

export class MockUrlService implements UrlService {
    productionBaseUrl: string;
    developmentBaseUrl: string;
    
    getBaseUrl(): string {
        return "";
    }

    isDevelopment(): boolean {
        return true;
    }
}