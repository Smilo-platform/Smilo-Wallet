import { Loading, NavOptions } from "ionic-angular";

export class MockLoading {
    constructor() {
        
    }
    /**
     * Present the loading instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions) {
        return null;
    }

    dismiss() {
        
    }
}