import { NavOptions } from "ionic-angular";

export class MockToast {
    present(navOptions?: NavOptions): Promise<any> {
        return Promise.resolve();
    }
}