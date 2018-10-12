import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TransferPage } from "./transfer";
import { IonicModule, NavController, NavParams, ToastController, Platform } from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { MockTransactionSignService } from "../../../test-config/mocks/MockTransactionSignService";
import { TransactionSignService } from "../../services/transaction-sign-service/transaction-sign-service";
import { MockTransferTransactionService } from "../../../test-config/mocks/MockTransferTransactionService";
import { TransferTransactionService } from "../../services/transfer-transaction-service/transfer-transaction";
import { BulkTranslateService } from "../../services/bulk-translate-service/bulk-translate-service";
import { MockBulkTranslateService } from "../../../test-config/mocks/MockBulkTranslateService";
import { MockAssetService } from "../../../test-config/mocks/MockAssetService";
import { AssetService } from "../../services/asset-service/asset-service";
import { MockToastController } from "../../../test-config/mocks/MockToastController";
import { MockPlatform } from "../../../test-config/mocks/MockPlatform";
import { MockQRScanner } from "../../../test-config/mocks/MockQRScanner";
import { QRScanner } from "@ionic-native/qr-scanner";
import { IPaymentRequest } from "../../models/IPaymentRequest";
import { MockToast } from "../../../test-config/mocks/MockToast";
import { Observable, Subscription } from "rxjs";
import { QRScannerStatus } from "@ionic-native/qr-scanner";
import { NgZone } from "@angular/core";
import { IBalance } from "../../models/IBalance";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

interface ICanTransferTestVector {
    publicKey: string;
    amount: string;
    enoughFunds: boolean;
    fromWallet: Smilo.IWallet;
    password: string;
    isValid: boolean;
}

interface IValidatePaymentRequestTestVector {
    paymentRequest: IPaymentRequest;
    isValid: boolean;
}

interface IHandleCameraScanResultTestVector {
    result: string;
    isValid: boolean;
    toastMessage?: string;
    toPublicKey?: string;
    amount?: string;
    chosenCurrency?: string;
}

interface IScanQRCodeTestVector {
    prepareResult?: QRScannerStatus;
    prepareError?: {
        code: number
    };
    text?: string;
    toastMessage?: string;
}

describe("TransferPage", () => {
    let comp: TransferPage;
    let fixture: ComponentFixture<TransferPage>;
    let navController: MockNavController;
    let navParams: MockNavParams;
    let transactionSignService: MockTransactionSignService;
    let transferTransactionService: MockTransferTransactionService;
    let bulkTranslateService: BulkTranslateService;
    let assetService: MockAssetService;
    let toastController: MockToastController;
    let platformService: MockPlatform;
    let qrScannerService: MockQRScanner;
    let zone: NgZone;

    beforeEach(async(() => {
        navController = new MockNavController();
        navParams = new MockNavParams();
        transactionSignService = new MockTransactionSignService();
        transferTransactionService = new MockTransferTransactionService();
        bulkTranslateService = new MockBulkTranslateService();
        assetService = new MockAssetService();
        toastController = new MockToastController();
        platformService = new MockPlatform();
        qrScannerService = new MockQRScanner();
        zone = new NgZone({});

        TestBed.configureTestingModule({
            declarations: [TransferPage],
            imports: [
                IonicModule.forRoot(TransferPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: MockTranslationLoader },
                }),
                ComponentsModule
            ],
            providers: [
                { provide: NavController, useValue: navController },
                { provide: NavParams, useValue: navParams },
                { provide: TransactionSignService, useValue: transactionSignService },
                { provide: TransferTransactionService, useValue: transferTransactionService },
                { provide: BulkTranslateService, useValue: bulkTranslateService },
                { provide: AssetService, useValue: assetService },
                { provide: ToastController, useValue: toastController },
                { provide: Platform, useValue: platformService },
                { provide: QRScanner, useValue: qrScannerService },
                { provide: NgZone, useValue: zone }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TransferPage);
        comp = fixture.componentInstance;
    });

    it("should create component", () => expect(comp).toBeDefined());

    it("should be initialized correctly", () => {
        spyOn(comp, "getAndSubscribeToTranslations");

        let wallet: Smilo.IWallet = <Smilo.IWallet>{};
        let balances: IBalance[] = [
            {
                currency: "XSM",
                amount: new Smilo.FixedBigNumber("100", 0),
                valueAmount: new Smilo.FixedBigNumber("100", 0)
            }
        ];

        spyOn(navParams, "get").and.callFake((key) => {
            if(key == "currentWallet")
                return wallet;
            else if(key == "currentWalletBalance")
                return balances;
        });

        comp.ionViewDidLoad();

        expect(comp.isTransferring).toBe(false);
        expect(comp.fromWallet).toBe(wallet);
        expect(comp.balances).toBe(balances);
        expect(comp.chosenCurrency).toBe("XSM");
        expect(comp.chosenCurrencyAmount.eq(new Smilo.FixedBigNumber("100", 0))).toBe(true);
        expect(comp.getAndSubscribeToTranslations).toHaveBeenCalled();
    });

    it("should hide the camera when leaving the page", () => {
        spyOn(comp, "hideCamera");

        comp.ionViewDidLeave();

        expect(comp.hideCamera).toHaveBeenCalled();
    });

    it("should validate input correctly", () => {
        let tests: ICanTransferTestVector[] = [
            {
                publicKey: "PUBLIC_KEY",
                amount: "100",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: true
            },
            // To/from address equal
            {
                publicKey: "PUBLIC_KEY",
                amount: "100",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: false
            },
            // No to address
            {
                publicKey: "",
                amount: "100",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: false
            },
            // No amount
            {
                publicKey: "PUBLIC_KEY",
                amount: "",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: false
            },
            // Invalid amount
            {
                publicKey: "PUBLIC_KEY",
                amount: "100.100.100",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: false
            },
            // No password
            {
                publicKey: "PUBLIC_KEY",
                amount: "100",
                enoughFunds: true,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "",
                isValid: false
            },
            // Not enough funds
            {
                publicKey: "PUBLIC_KEY",
                amount: "100",
                enoughFunds: false,
                fromWallet: <Smilo.IWallet>{
                    publicKey: "OTHER_PUBLIC_KEY"
                },
                password: "PASSWORD",
                isValid: false
            }
        ];

        for(let test of tests) {
            comp.toPublicKey = test.publicKey;
            comp.amount = test.amount;
            comp.enoughFunds = test.enoughFunds;
            comp.fromWallet = test.fromWallet;
            comp.password = test.password;

            expect(comp.canTransfer()).toBe(test.isValid);
        }
    });

    it("should reset the transfer state correctly", () => {
        comp.isTransferring = true;
        comp.errorMessage = "ERROR";
        comp.statusMessage = "STATUS";

        comp.resetTransferState();

        expect(comp.isTransferring).toBe(false);
        expect(comp.errorMessage).toBe("");
        expect(comp.statusMessage).toBe("");
    });

    it("should set 'enoughFunds' to true if there are enough funds", () => {
        comp.chosenCurrencyAmount = new Smilo.FixedBigNumber("1000", 0);
        comp.amount = "100";

        comp.onAmountChanged();

        expect(comp.enoughFunds).toBe(true);
    });

    it("should set 'enoughFunds' to false if there are not enough funds", () => {
        comp.chosenCurrencyAmount = new Smilo.FixedBigNumber("1000", 0);
        comp.amount = "10000";

        comp.onAmountChanged();

        expect(comp.enoughFunds).toBe(false);
    });

    it("should transfer funds correctly", (done) => {
        spyOn(comp, "resetTransferState");

        // Mock translations map
        comp.translations = new Map<string, string>();
        spyOn(comp.translations, "get").and.callFake((key) => key);

        let transaction: Smilo.ITransaction = <Smilo.ITransaction>{};

        spyOn(comp, "createTransaction").and.returnValue(transaction);
        spyOn(comp, "signTransaction").and.callFake((t) => {
            expect(t).toBe(transaction);

            return Promise.resolve();
        });
        spyOn(transferTransactionService, "sendTransaction").and.callFake((t) => {
            expect(t).toEqual(transaction);

            return Promise.resolve();
        });

        comp.toPublicKey = "PUBLIC_KEY";
        comp.amount = "100";
        comp.enoughFunds = true;
        comp.password = "PASSWORD";
        comp.chosenCurrency = "XSM";
        comp.balances = [
            {
                currency: "XSM",
                amount: new Smilo.FixedBigNumber("200", 0),
                valueAmount: new Smilo.FixedBigNumber("200", 0)
            }
        ];

        let promise = comp.transfer();

        expect(comp.resetTransferState).toHaveBeenCalled();
        expect(comp.isTransferring).toBe(true);
        expect(comp.statusMessage).toBe("transfer.signing_transaction");

        promise.then(
            () => {
                // Expect user to be notified of success
                expect(comp.statusMessage).toBe("transfer.sent_success");
                expect(comp.isTransferring).toBe(false);

                // Balance should be updated correctly
                expect(comp.balances[0].amount.eq(new Smilo.FixedBigNumber("100", 0))).toBe(true);

                // Expect input fields to be reset
                expect(comp.toPublicKey).toBe("");
                expect(comp.amount).toBe(null);
                expect(comp.enoughFunds).toBe(undefined);
                expect(comp.password).toBe("");

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should not be called");
                done();
            }
        );
    });

    it("should create the transaction correctly", () => {
        // This unit test is written to only support XSM (000x00123) right now.
        comp.fromWallet = <Smilo.IWallet>{
            publicKey: "PUBLIC_KEY"
        };
        comp.amount = "100";
        comp.toPublicKey = "TO_PUBLIC_KEY";

        expect(comp.createTransaction()).toEqual(
            // We have to cast to any because of the jasmine.any syntax
            <any>{
                timestamp: jasmine.any(Number),
                inputAddress: "PUBLIC_KEY",
                fee: new Smilo.FixedBigNumber(0, 0),
                assetId: "000x00123",
                inputAmount: new Smilo.FixedBigNumber("100", 0),
                transactionOutputs: [
                    {
                        outputAddress: "TO_PUBLIC_KEY",
                        outputAmount: new Smilo.FixedBigNumber("100", 0)
                    }
                ],
                dataHash: jasmine.any(String)
            }
        );
    });

    it("should sign the transaction correctly", (done) => {
        let wallet: Smilo.IWallet = <Smilo.IWallet>{};
        let password = "PASSWORD";
        let transaction: Smilo.ITransaction = <Smilo.ITransaction>{};

        spyOn(transactionSignService, "sign").and.returnValue(Promise.resolve());

        comp.fromWallet = wallet;
        comp.password = password;
        
        comp.signTransaction(transaction).then(
            () => {
                expect(transactionSignService.sign).toHaveBeenCalledWith(
                    wallet,
                    password,
                    transaction
                );

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should not be called");

                done();
            }
        );
    });

    it("should validate payment requests correctly", () => {
        let tests: IValidatePaymentRequestTestVector[] = [
            {
                paymentRequest: {
                    receiveAddress: "S173C2LE2SULSN3XZPX5DIYCVL3SPY5VIC6SLG",
                    amount: "100",
                    assetId: "000x00123"
                },
                isValid: true
            },
            // Empty address
            {
                paymentRequest: {
                    receiveAddress: "",
                    amount: "100",
                    assetId: "000x00123"
                },
                isValid: false
            },
            // Invalid address
            {
                paymentRequest: {
                    receiveAddress: "SOME_ADDRESS",
                    amount: "100",
                    assetId: "000x00123"
                },
                isValid: false
            },
            // Empty amount
            {
                paymentRequest: {
                    receiveAddress: "S173C2LE2SULSN3XZPX5DIYCVL3SPY5VIC6SLG",
                    amount: "",
                    assetId: "000x00123"
                },
                isValid: false
            },
            // Empty asset id
            {
                paymentRequest: {
                    receiveAddress: "S173C2LE2SULSN3XZPX5DIYCVL3SPY5VIC6SLG",
                    amount: "100",
                    assetId: ""
                },
                isValid: false
            }
        ];

        for(let test of tests) {
            expect(comp.isValidPaymentRequest(test.paymentRequest)).toBe(test.isValid, test);
        }
    });

    it("should show the camera correctly", () => {
        comp.cameraIsShown = false;
        spyOn(comp, "hideUI");
        spyOn(qrScannerService, "show");
        spyOn(platformService, "is").and.returnValue(false);
        spyOn(platformService, "registerBackButtonAction");

        comp.showCamera();

        expect(comp.hideUI).toHaveBeenCalled();
        expect(qrScannerService.show).toHaveBeenCalled();
        expect(platformService.registerBackButtonAction).not.toHaveBeenCalled();
        expect(comp.cameraIsShown).toBe(true);

    });

    it("should listen to the back button when showing the camera on Android", () => {
        spyOn(comp, "hideUI");
        spyOn(qrScannerService, "show");
        spyOn(platformService, "is").and.returnValue(true);
        spyOn(platformService, "registerBackButtonAction");

        comp.showCamera();

        expect(comp.hideUI).toHaveBeenCalled();
        expect(qrScannerService.show).toHaveBeenCalled();
        expect(platformService.registerBackButtonAction).toHaveBeenCalled();
    });

    it("should hide the camera correctly", () => {
        comp.cameraIsShown = true;
        spyOn(qrScannerService, "hide");
        spyOn(qrScannerService, "destroy");
        spyOn(comp, "showUI");
        spyOn(platformService, "is").and.returnValue(false);

        let scanSubscription = new Subscription();
        comp.scanSubscription = scanSubscription;

        spyOn(scanSubscription, "unsubscribe");

        let unregisterDummySpy = jasmine.createSpy();
        comp.unregisterBackButtonFunction = unregisterDummySpy;

        comp.hideCamera();

        expect(qrScannerService.hide).toHaveBeenCalled();
        expect(qrScannerService.destroy).toHaveBeenCalled();
        expect(comp.showUI).toHaveBeenCalled();
        expect(unregisterDummySpy).not.toHaveBeenCalled();
        expect(scanSubscription.unsubscribe).toHaveBeenCalled();
        expect(comp.cameraIsShown).toBe(false);
    });

    it("should unregister from listening to the back button when hiding the camera on Android", () => {
        spyOn(qrScannerService, "hide");
        spyOn(qrScannerService, "destroy");
        spyOn(comp, "showUI");
        spyOn(platformService, "is").and.returnValue(true);

        let unregisterDummySpy = jasmine.createSpy();
        comp.unregisterBackButtonFunction = unregisterDummySpy;

        comp.hideCamera();

        expect(unregisterDummySpy).toHaveBeenCalled();
    });

    it("should show the UI correctly", () => {
        comp.showUI();

        expect(document.body.className).toBe("");
    });

    it("should hide the UI correctly", () => {
        comp.hideUI();

        expect(document.body.className).toBe("camera-ready");
    });

    it("should start the QR code scanner correctly", (done) => {
        let tests: IScanQRCodeTestVector[] = [
            // Scan succeeded
            {
                prepareResult: <QRScannerStatus>{
                    authorized: true
                },
                text: "Scanned Text"
            },
            // User denied camera access permanently
            {
                prepareResult: <QRScannerStatus>{
                    denied: true
                },
                toastMessage: "transfer.scanner.access_denied"
            },
            // Use denied camera access just this once
            {
                prepareResult: <QRScannerStatus>{
                    
                },
                toastMessage: "transfer.scanner.access_denied"
            },
            // Access denied rejection
            {
                prepareError: {
                    code: 1
                },
                toastMessage: "transfer.scanner.access_denied"
            },
            // Unknown error
            {
                prepareError: {
                    code: 100
                },
                toastMessage: "transfer.scanner.failure"
            }
        ];

        // Mock toast
        let mockToast = new MockToast();
        let presentSpy = jasmine.createSpy("Toast present");
        mockToast.present = presentSpy;

        // Mock toast service
        let expectedToastMessage: string;
        spyOn(toastController, "create").and.callFake((options) => {
            expect(options.message).toBe(expectedToastMessage);

            return mockToast;
        });

        // Mock translations map
        comp.translations = new Map<string, string>();
        spyOn(comp.translations, "get").and.callFake((key) => key);

        // Mock show camera
        let showCameraSpy = jasmine.createSpy("Show camera");
        comp.showCamera = showCameraSpy;

        // Mock qr scanner
        let qrScannerPrepareResult: QRScannerStatus;
        let qrScannerPrepareError: {code: number};
        spyOn(qrScannerService, "prepare").and.callFake(() => {
            if(qrScannerPrepareError)
                return Promise.reject(qrScannerPrepareError);
            else
                return Promise.resolve(qrScannerPrepareResult);
        });

        let qrScannerScanResult: string;
        spyOn(qrScannerService, "scan").and.callFake(() => {
            return Observable.of(qrScannerScanResult);
        });

        // Mock ng zone
        spyOn(zone, "run").and.callFake((func) => {
            func();
        });

        // Mock handle camera scan result
        let handleCameraScanResultSpy = jasmine.createSpy("Handle camera scan result");
        comp.handleCameraScanResult = handleCameraScanResultSpy;

        let promise = Promise.resolve();
        for(let test of tests) {
            promise = promise.then(
                () => doTest(test)
            );
        }

        function doTest(test: IScanQRCodeTestVector): Promise<void> {
            qrScannerPrepareResult = test.prepareResult;
            qrScannerPrepareError = test.prepareError;
            qrScannerScanResult = test.text;
            expectedToastMessage = test.toastMessage;

            return comp.scanQRCode().then(
                () => {
                    if(test.prepareError) {
                        expect(presentSpy).toHaveBeenCalled();
                        expect(showCameraSpy).not.toHaveBeenCalled();
                    }
                    else {
                        if(test.prepareResult.authorized) {
                            // Scanning should have worked
                            expect(handleCameraScanResultSpy).toHaveBeenCalledWith(test.text);
                            expect(showCameraSpy).toHaveBeenCalledTimes(1);
                        }
                        else if(test.prepareResult.denied) {
                            // Scanning denied by user
                            expect(presentSpy).toHaveBeenCalled();
                            expect(showCameraSpy).not.toHaveBeenCalled();
                        }
                        else {
                            // Scanning denied by user but not permanently
                            expect(presentSpy).toHaveBeenCalled();
                            expect(showCameraSpy).not.toHaveBeenCalled();
                        }
                    }

                    presentSpy.calls.reset();
                    showCameraSpy.calls.reset();
                    handleCameraScanResultSpy.calls.reset();
                }
            );
        }

        promise.then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should not be called");
            }
        );
    });

    it("should handle a QR scan result correctly", () => {
        let tests: IHandleCameraScanResultTestVector[] = [
            {
                result: `{"receiveAddress": "PUBLIC_KEY", "amount": "100", "assetId": "000x00123"}`,
                toPublicKey: "PUBLIC_KEY",
                amount: "100",
                chosenCurrency: "XSM",
                isValid: true
            },
            // Invalid JSON
            {
                result: `NOT_JSON`,
                isValid: false,
                toastMessage: "transfer.scanner.scan_failure"
            },
            // Invalid QR code but valid JSON
            {
                result: `{"this": "is", "valid": "json"}`,
                isValid: false,
                toastMessage: "transfer.scanner.scan_failure"
            }
        ];

        // Mock toast
        let mockToast = new MockToast();
        let presentSpy = jasmine.createSpy("Present toast");
        mockToast.present = presentSpy;

        // Mock hide camera
        let hideCameraSpy = jasmine.createSpy("Hide camera");
        comp.hideCamera = hideCameraSpy;

        // Mock create toast
        let expectedToastMessage: string = null;
        spyOn(toastController, "create").and.callFake((options) => {
            expect(options.message).toBe(expectedToastMessage);

            return mockToast;
        });

        // Mock payment request validation
        let expectedValidationResult: boolean;
        spyOn(comp, "isValidPaymentRequest").and.callFake(() => {
            return expectedValidationResult;
        });

        // Mock on amount changed
        spyOn(comp, "onAmountChanged");

        // Mock translations map
        comp.translations = new Map<string, string>();
        spyOn(comp.translations, "get").and.callFake((key) => key);

        for(let test of tests) {
            expectedToastMessage = test.toastMessage;
            expectedValidationResult = test.isValid;

            comp.handleCameraScanResult(test.result);

            if(test.isValid) {
                // Expect no toast to have been shown
                expect(mockToast.present).not.toHaveBeenCalled();

                // Expect the input fields to have been set
                expect(comp.toPublicKey).toBe(test.toPublicKey);
                expect(comp.amount).toBe(test.amount);
                expect(comp.chosenCurrency).toBe(test.chosenCurrency);
            }
            else {
                // Expect a toast to have been shown if the input is invalid
                expect(mockToast.present).toHaveBeenCalled();
                presentSpy.calls.reset();
            }

            // In all cases camera should be hidden
            expect(comp.hideCamera).toHaveBeenCalled();

            hideCameraSpy.calls.reset();
        }
    });
});