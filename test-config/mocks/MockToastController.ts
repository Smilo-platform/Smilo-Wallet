import { ToastController, ToastOptions, Toast, Config, App, Platform } from "ionic-angular";
import { MockToast } from "./MockToast";

export class MockToastController extends ToastController {

    constructor() {
        super(new App(new Config(), new Platform()), new Config());
    }

    create(opts?: ToastOptions): MockToast {
        return new MockToast();
    }
}