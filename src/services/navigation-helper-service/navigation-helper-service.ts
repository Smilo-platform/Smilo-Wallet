import { Injectable } from "@angular/core";
import { NavController } from "ionic-angular";

export interface INavigationHelperService {
    navigateBack(navCtrl: NavController, amount: number): Promise<void>;
}

@Injectable()
export class NavigationHelperService implements INavigationHelperService {
    constructor() {

    }

    navigateBack(navCtrl: NavController, amount: number): Promise<void> {
        let promise = Promise.resolve();

        for(let i = 0; i < amount; i++) {
            promise.then(
                () => navCtrl.pop({animate: false})
            );
        }

        return promise;
    }
}