import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export interface IPasswordValidationResult {
    type: "success" | "warning" | "error";
    message?: string;
}

export interface IPasswordService {
    validate(password: string, passwordConfirm: string): IPasswordValidationResult;
}

@Injectable()
export class PasswordService implements IPasswordService {
     passwordWeakWarning: string;
     passwordNotMatchingError: string;

    constructor(private translateService: TranslateService) {
        this.loadTranslation();
    }

    loadTranslation() {
        this.translateService.get("password_messages.warnings.weak").subscribe(
            (message) => {
                this.passwordWeakWarning = message;
            }
        );

        this.translateService.get("password_messages.errors.not_matching").subscribe(
            (message) => {
                this.passwordNotMatchingError = message;
            }
        );
    }

    /**
     * Validates if the given password 
     */
    validate(password: string, passwordConfirm: string): IPasswordValidationResult {
        // TODO: do a password strength test
        if(password != passwordConfirm) {
            return {
                type: "error",
                message: this.passwordNotMatchingError
            };
        }
        else {
            return {
                type: "success"
            }
        }
    }
}