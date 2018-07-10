import { IWallet } from "../../models/IWallet";

export function getConfigStorageKey(wallet: IWallet): string {
    return `${ wallet.id }-config`; 
}

export function getLayerStorageKeys(wallet: IWallet, layerCount: number): string[] {
    let layerKeys: string[] = []; 
 
    for(let i = 0; i < layerCount; i++) { 
        layerKeys.push(`${ wallet.id }-layer-${ i }`); 
    } 
        
    return layerKeys; 
}