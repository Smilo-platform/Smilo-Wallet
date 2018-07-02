import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function WalletIndexValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let number = Number(control.value);

        if(isNaN(number)) {
            // Not a number
            return {
                number: false
            };
        }
        else if(number % 1 != 0) {
            // Not an integer
            return {
                integer: false
            };
        }
        else if(number < 0) {
            // Less than zero
            return {
                negative: false
            };
        }
        else {
            return null;
        }
    };
}