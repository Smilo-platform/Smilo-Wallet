import { Alert, NavOptions, Config } from "ionic-angular";

export class MockAlert extends Alert {
    constructor() {
        super(null, {}, new Config());
    }
    /**
     * Present the alert instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any> {
        return Promise.resolve();
    }
}