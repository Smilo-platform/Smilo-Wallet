import { AndroidPermissions } from "@ionic-native/android-permissions";

export class MockAndroidPermissions extends AndroidPermissions {
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