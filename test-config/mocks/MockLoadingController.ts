import { LoadingController, LoadingOptions } from "ionic-angular";
import { MockLoading } from "./MockLoading";

export class MockLoadingController extends LoadingController {
    constructor() {
        super(null, null);
    }
    /**
     * Create a loading indicator. See below for options.
     * @param {LoadingOptions} [opts] Loading options
     * @returns {Loading} Returns a Loading Instance
     */
    create(opts?: LoadingOptions) {
        return <any>new MockLoading();
    }
    
}