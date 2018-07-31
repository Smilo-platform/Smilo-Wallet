import Big from "big.js";

export class BigNumberHelper {
    /**
     * Prepares the given 'number' (stored as a string) for the given asset id.
     * 
     * This will return a Big number which can be used to accurately perform decimal calculations.
     */
    prepareBigNumber(numberAsString: string, decimals: number): Big {
        // Add the decimal point in the numberAsString variable
        numberAsString = this.insertDecimalDot(numberAsString, decimals);

        return Big(numberAsString);
    }

    /**
     * Converts the given Big number into a string symbolizing a Big Integer.
     */
    toBigIntegerString(number: Big, decimals: number): string {
        let numberString = number.toString();

        let dotIndex = numberString.indexOf(".");
        if(dotIndex == -1)
            dotIndex = 0;

        let beforeDot = numberString.substr(0, dotIndex);
        let afterDot = numberString.substr(dotIndex + 1);
        
        afterDot = this.padStringEnd(afterDot, "0", decimals);

        return beforeDot + afterDot;
    }

    /**
     * Inserts a dot (e.g. '.') at the specified index in the given string.
     * The index is counted from the right and not from left.
     * @param numberAsString 
     * @param dotIndex 
     */
    private insertDecimalDot(numberAsString: string, dotIndex: number): string {
        // Pad string if too short
        numberAsString = this.padStringStart(numberAsString, "0", dotIndex);

        // Insert dot
        return numberAsString.substr(0, numberAsString.length - dotIndex) + "." + numberAsString.substr(numberAsString.length - dotIndex);
    }

    /**
     * Pads the start of the given string with the pad string until the target length has been reached or exceeded.
     * @param str 
     * @param pad 
     * @param targetLength 
     */
    private padStringStart(str: string, pad: string, targetLength: number): string {
        while(str.length < targetLength)
            str = pad + str;

        return str;
    }

    /**
     * Pads the end of the given string with the pad string until the target length has been reached or exceeded.
     * @param str 
     * @param pad 
     * @param targetLength 
     */
    private padStringEnd(str: string, pad: string, targetLength: number): string {
        while(status.length < targetLength)
            str += pad;

        return str;
    }
}