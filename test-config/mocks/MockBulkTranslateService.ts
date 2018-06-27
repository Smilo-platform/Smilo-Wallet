import { BulkTranslateService } from "../../src/services/bulk-translate-service/bulk-translate-service";

export class MockBulkTranslateService extends BulkTranslateService {
    constructor() {
        super(null);
    }

    getTranslations(keys: string[]): Promise<Map<string, string>> {
        return Promise.resolve(new Map<string, string>());
    }
}