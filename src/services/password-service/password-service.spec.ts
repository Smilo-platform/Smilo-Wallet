import { PasswordService } from "./password-service";
import { NavController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { MockTranslateService } from "../../../test-config/mocks/MockTranslateService";

describe("PasswordService", () => {
    let service: PasswordService;
    let translateService: TranslateService;

    beforeEach(() => {
        translateService = new MockTranslateService();

        service = new PasswordService(translateService);
    });

    it("should be initialized correctly", () => {
        expect(service.passwordWeakWarning).toBe("password_messages.warnings.weak");
        expect(service.passwordNotMatchingError).toBe("password_messages.errors.not_matching");
    });

    it("should detect non-matching passwords correctly", () => {
        expect(service.validate("pass123", "pass12345")).toEqual({
            type: "error",
            message: "password_messages.errors.not_matching"
        });

        expect(service.validate("", "pass12345")).toEqual({
            type: "error",
            message: "password_messages.errors.not_matching"
        });

        expect(service.validate("pass123", "")).toEqual({
            type: "error",
            message: "password_messages.errors.not_matching"
        });
    });

    it("should detect valid passwords correctly", () => {
        expect(service.validate("pass123", "pass123")).toEqual({
            type: "success"
        });
    });
});