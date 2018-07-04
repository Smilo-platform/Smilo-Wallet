import { HttpClient } from "@angular/common/http";

export class MockHttpClient extends HttpClient {
    constructor() {
        super(null);
    }
}