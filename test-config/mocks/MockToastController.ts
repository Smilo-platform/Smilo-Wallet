import { ToastController, ToastOptions, Toast } from "ionic-angular";

export class MockToastController extends ToastController {

    constructor() {
        super(null, null);
    }

    create(opts?: ToastOptions) {
        return null;
    }

    present(): Promise<void> {
        return Promise.resolve();
    }
}