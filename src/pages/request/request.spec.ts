import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RequestPage } from "./request";
import { IonicModule, NavParams } from "ionic-angular/index";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockModalController } from "../../../test-config/mocks/MockModalController";
import { MockSettingsService } from "../../../test-config/mocks/MockSettingsService";
import { ModalController, NavController } from "ionic-angular";
import { SettingsService } from "../../services/settings-service/settings-service";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { BehaviorSubject } from "rxjs";
import { IBalance } from "../../models/IBalance";
import { MockModal } from "../../../test-config/mocks/MockModal";
import { QrCodePage } from "../qr-code-page/qr-code-page";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

interface ICanTransferTestVector {
    publicKey: string;
    amount: string;
    isValid: boolean;
}

describe("RequestPage", () => {
    let comp: RequestPage;
    let fixture: ComponentFixture<RequestPage>;
    let navParams: MockNavParams;
    let navController: MockNavController;
    let modalController: MockModalController;
    let settingsService: MockSettingsService;

    beforeEach(async(() => {
        navParams = new MockNavParams();
        modalController = new MockModalController();
        settingsService = new MockSettingsService();
        navController = new MockNavController();

        TestBed.configureTestingModule({
            declarations: [RequestPage],
            imports: [
                IonicModule.forRoot(RequestPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: MockTranslationLoader },
                }),
                ComponentsModule
            ],
            providers: [
                { provide: NavParams, useValue: navParams },
                { provide: ModalController, useValue: modalController },
                { provide: SettingsService, useValue: settingsService },
                { provide: NavController, useValue: navController }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RequestPage);
        comp = fixture.componentInstance;
    });

    it("should create component", () => expect(comp).toBeDefined());

    it("should be initialized correctly", () => {
        let wallet: Smilo.IWallet = <Smilo.IWallet>{};
        let balances: IBalance[] = <IBalance[]>[{currency: "XSM"}];
        let activeTheme = new BehaviorSubject("light-theme");

        spyOn(navParams, "get").and.callFake((key) => {
            switch(key) {
                case("currentWallet"):
                    return wallet;
                case("currentWalletBalance"):
                    return balances;
            }
        });

        spyOn(settingsService, "getActiveTheme").and.returnValue(activeTheme);
        spyOn(activeTheme, "subscribe");

        comp.ionViewDidLoad();

        expect(comp.fromWallet).toBe(wallet);
        expect(comp.balances).toBe(balances);
        expect(comp.chosenCurrency).toBe("XSM");
        expect(activeTheme.subscribe).toHaveBeenCalled();
    });

    it("should start generating the QR code correctly", () => {
        comp.fromWallet = <Smilo.IWallet>{
            publicKey: "PUBLIC_KEY"
        };
        comp.amount = "100";
        comp.selectedTheme = "light-theme";

        let mockModal = new MockModal();
        spyOn(modalController, "create").and.returnValue(mockModal);
        spyOn(mockModal, "present");

        comp.generateQRCode();

        expect(modalController.create).toHaveBeenCalledWith(
            QrCodePage,
            {
                paymentRequest: {
                    receiveAddress: "PUBLIC_KEY",
                    amount: "100",
                    assetId: "0x000000536d696c6f"
                }
            },
            {
                cssClass: "light-theme"
            }
        );

        expect(mockModal.present).toHaveBeenCalled();
    });

    it("should validate correctly", () => {
        let tests: ICanTransferTestVector[] = [
            {
                publicKey: "PUBLIC_KEY",
                amount: "100",
                isValid: true
            },
            {
                publicKey: "",
                amount: "100",
                isValid: false // Empty public key
            },
            {
                publicKey: undefined,
                amount: "100",
                isValid: false // No public key
            },
            {
                publicKey: "PUBLIC_KEY",
                amount: "",
                isValid: false // Empty amount
            },
            {
                publicKey: "PUBLIC_KEY",
                amount: undefined,
                isValid: false // No amount
            },
            {
                publicKey: "PUBLIC_KEY",
                amount: "100.100.100",
                isValid: false // Invalid amount
            }
        ];

        for(let test of tests) {
            comp.fromWallet = <Smilo.IWallet>{
                publicKey: test.publicKey
            };
            comp.amount = test.amount;

            expect(comp.canTransfer()).toBe(test.isValid, test);
        }
    });
});