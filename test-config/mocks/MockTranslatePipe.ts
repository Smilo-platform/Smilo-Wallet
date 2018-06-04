import { TranslatePipe } from "@ngx-translate/core";

export class MockTranslatePipe extends TranslatePipe {
    updateValue(key: string, interpolateParams?: Object, translations?: any): void {

    }
    
    transform(query: string, ...args: any[]): any {
        return query;
    }
}