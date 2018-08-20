import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { Observable } from "rxjs";

export class MockQRScanner extends QRScanner {
    prepare(): Promise<QRScannerStatus> {
        let result: QRScannerStatus = {
            authorized: true,
            denied: false,
            restricted: false,
            prepared: true,
            showing: false,
            scanning: false,
            previewing: false,
            lightEnabled: false,
            canOpenSettings: false,
            canChangeCamera: false,
            canEnableLight: false,
            currentCamera: 0
        };

        return Promise.resolve(result);
    }

    scan(): Observable<string> {
        return Observable.of("test");
    }
}