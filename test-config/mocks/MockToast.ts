import { NavOptions, Toast, Config } from "ionic-angular";

export class MockToast extends Toast {
    constructor() {
        super(null, {}, new Config());
    }

    present(navOptions?: NavOptions): Promise<any> {
        return Promise.resolve();
    }
}