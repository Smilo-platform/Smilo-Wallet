import * as Smilo from "@smilo-platform/smilo-commons-js-web";
import { Storage } from "@ionic/storage";

export class IonicStorage implements Smilo.IStorageManager {
    constructor(private storage: Storage) {

    }

    read(path: string): Promise<string> {
        return this.storage.get(path);
    }
    write(path: string, data: string): Promise<void> {
        return this.storage.set(path, data);
    }

    readJSON<T>(path: string): Promise<T> {
        return this.read(path).then(
            (data) => JSON.parse(data)
        );
    }
    writeJSON(path: string, data: any): Promise<void> {
        return this.write(path, JSON.stringify(data));
    }

    remove(path: string): Promise<void> {
        return this.storage.remove(path);
    }
}