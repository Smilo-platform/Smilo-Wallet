import { Clipboard } from "@ionic-native/clipboard";

export class MockClipboard implements Clipboard {
    copy(text: string): Promise<any> {
        return Promise.resolve();
    }
    paste(): Promise<any> {
        return Promise.resolve();
    }
    clear(): Promise<any> {
        return Promise.resolve();
    }
}