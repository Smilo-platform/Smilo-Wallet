import { HockeyApp } from "ionic-hockeyapp";
import { Platform } from "ionic-angular";

export class MockHockeyApp extends HockeyApp {
    constructor() {
        super(new Platform());
    }

    start(androidAppId: string, iosAppId: string, sendAutoUpdates: boolean, ignoreErrorHeader: boolean): Promise<any> {
        return Promise.resolve();
    }
    trackEvent(name: string): Promise<any> {
        return Promise.resolve();
    }
    checkHockeyAppUpdates(): Promise<any> {
        return Promise.resolve();
    }
    forceCrash(): Promise<any> {
        return Promise.resolve();
    }
    composeFeedback(attachScreenshot: boolean, data: any): Promise<any> {
        return Promise.resolve();
    }
    feedback(): Promise<any> {
        return Promise.resolve();
    }
    addMetaData(data: any): Promise<any> {
        return Promise.resolve();
    }
    setUserEmail(userEmail: string): Promise<any> {
        return Promise.resolve();
    }
    setUserName(userName: string): Promise<any> {
        return Promise.resolve();
    }
}