import { AlertController, AlertOptions, Alert } from "ionic-angular";
import { MockAlert } from "./MockAlert";

export class MockAlertController extends AlertController {
    constructor() {
        super(null, null);
    }
    /**
     * Display an alert with a title, inputs, and buttons
     * @param {AlertOptions} opts Alert. See the table below
     */
    create(opts?: AlertOptions): Alert {
        return new MockAlert();
    }
} 