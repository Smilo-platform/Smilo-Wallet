import { ModalController, ModalOptions, Modal } from "ionic-angular";

export class MockModalController extends ModalController {
    constructor() {
        super(null, null, null);
    }

    create(component: any, data?: any, opts?: ModalOptions): Modal {
        return null;
    }
}