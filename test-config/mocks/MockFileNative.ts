import { File as FileNative, DirectoryEntry, RemoveResult, Entry, FileEntry, Flags } from "@ionic-native/file";
import { IWriteOptions } from "../../src/pages/wallet-overview/wallet-overview";

export class MockFileNative extends FileNative {
    applicationDirectory: string;
    applicationStorageDirectory: string;
    dataDirectory: string;
    cacheDirectory: string;
    externalApplicationStorageDirectory: string;
    externalDataDirectory: string;
    externalCacheDirectory: string;
    externalRootDirectory: string;
    tempDirectory: string;
    syncedDataDirectory: string;
    documentsDirectory: string;
    sharedDirectory: string;
    cordovaFileError: any;
    getFreeDiskSpace(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    checkDir(path: string, dir: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    createDir(path: string, dirName: string, replace: boolean): Promise<DirectoryEntry> {
        throw new Error("Method not implemented.");
    }
    removeDir(path: string, dirName: string): Promise<RemoveResult> {
        throw new Error("Method not implemented.");
    }
    moveDir(path: string, dirName: string, newPath: string, newDirName: string): Promise<DirectoryEntry | Entry> {
        throw new Error("Method not implemented.");
    }
    copyDir(path: string, dirName: string, newPath: string, newDirName: string): Promise<Entry> {
        throw new Error("Method not implemented.");
    }
    listDir(path: string, dirName: string): Promise<Entry[]> {
        throw new Error("Method not implemented.");
    }
    removeRecursively(path: string, dirName: string): Promise<RemoveResult> {
        throw new Error("Method not implemented.");
    }
    checkFile(path: string, file: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    createFile(path: string, fileName: string, replace: boolean): Promise<FileEntry> {
        throw new Error("Method not implemented.");
    }
    removeFile(path: string, fileName: string): Promise<RemoveResult> {
        throw new Error("Method not implemented.");
    }
    writeFile(path: string, fileName: string, text: string | Blob | ArrayBuffer, options?: IWriteOptions): Promise<any> {
        return Promise.resolve();
    }
    writeExistingFile(path: string, fileName: string, text: string | Blob): Promise<void> {
        throw new Error("Method not implemented.");
    }
    readAsText(path: string, file: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    readAsDataURL(path: string, file: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    readAsBinaryString(path: string, file: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    readAsArrayBuffer(path: string, file: string): Promise<ArrayBuffer> {
        throw new Error("Method not implemented.");
    }
    moveFile(path: string, fileName: string, newPath: string, newFileName: string): Promise<Entry> {
        throw new Error("Method not implemented.");
    }
    copyFile(path: string, fileName: string, newPath: string, newFileName: string): Promise<Entry> {
        throw new Error("Method not implemented.");
    }
    resolveLocalFilesystemUrl(fileUrl: string): Promise<Entry> {
        throw new Error("Method not implemented.");
    }
    resolveDirectoryUrl(directoryUrl: string): Promise<DirectoryEntry> {
        throw new Error("Method not implemented.");
    }
    getDirectory(directoryEntry: DirectoryEntry, directoryName: string, flags: Flags): Promise<DirectoryEntry> {
        throw new Error("Method not implemented.");
    }
    getFile(directoryEntry: DirectoryEntry, fileName: string, flags: Flags): Promise<FileEntry> {
        throw new Error("Method not implemented.");
    }
}