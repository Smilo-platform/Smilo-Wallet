import { ToastController, ToastOptions, Toast } from "ionic-angular";
import { MockToast } from "./MockToast";

export class MockToastController extends ToastController {

    constructor() {
        super(null, null);
    }

    create(opts?: ToastOptions): Toast {
        return new MockToast();
    }

    present(): Promise<void> {
        return Promise.resolve();
    }
}