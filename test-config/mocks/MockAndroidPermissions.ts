import { AndroidPermissions } from "@ionic-native/android-permissions";

export class MockAndroidPermissions implements AndroidPermissions {
    constructor() {
        
    }

    PERMISSION: any;
    checkPermission(permission: string): Promise<any> {
        return Promise.resolve();
    }
    requestPermission(permission: string): Promise<any> {
        return Promise.resolve();
    }
    requestPermissions(permissions: string[]): Promise<any> {
        return Promise.resolve();
    }
    hasPermission(permission: string): Promise<any> {
        return Promise.resolve();
    }
}