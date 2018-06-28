import { browser, by, element, ExpectedConditions, WebElement, promise } from "protractor";

require('events').EventEmitter.defaultMaxListeners = Infinity;

/**
 * Delay applied after certain actions. 
 */
const ANGULAR_DELAY = 500;

export function clickElementByClassName(className: string, delay?: number): promise.Promise<void> {
    return element(by.className(className)).click().then(
        () => browser.sleep(delay || ANGULAR_DELAY)
    );
}