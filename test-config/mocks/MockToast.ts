import { NavOptions, Toast, Config, App, Platform } from "ionic-angular";

export class MockToast extends Toast {
    constructor() {
        super(new App(new Config(), new Platform()), {}, new Config());
    }

    present(navOptions?: NavOptions): Promise<any> {
        return Promise.resolve();
    }
}