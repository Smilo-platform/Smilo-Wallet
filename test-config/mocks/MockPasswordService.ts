import { IPasswordService, IPasswordValidationResult } from "../../src/services/password-service/password-service";

export class MockPasswordService implements IPasswordService {
    validate(password: string, passwordConfirm: string): IPasswordValidationResult {
        throw new Error("Method not implemented.");
    }
}