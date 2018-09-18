var fs = require("fs");

const TRANSLATION_ROOT_PATH = "./src/assets/i18n/";
const TRANSLATION_BASE = "en";

let isCI = process.argv[2] == "--ci";

Promise.all([
    // Get the base translation file
    readJSONFile(`${ TRANSLATION_ROOT_PATH }${ TRANSLATION_BASE }.json`),
    // Get all available languages
    getAvailableLanguages()
]).then(
    (result) => {
        let baseTranslation = result[0];
        let languages = result[1];

        let promise = Promise.resolve();

        let foundErrors = false;
        for(let language of languages) {
            if(language == TRANSLATION_BASE)
                continue;

            promise = promise.then(
                () => readJSONFile(`${ TRANSLATION_ROOT_PATH }${ language }.json`)
            ).then(
                (otherTranslation) => {
                    let errors = compareLanguages(baseTranslation, otherTranslation, language);

                    if(errors.length > 0) {
                        console.log(`---- Translation '${ language }' contains errors ----`);
                        for(let error of errors) {
                            console.log(error);
                        }
                        console.log();

                        foundErrors = true;

                        // Write amended file
                        let json = JSON.stringify(otherTranslation, null, 4);

                        // Malform MISSING_KEY entries. This results in syntax errors in the JSON
                        // which in turn will make it easier for us to spot the MISSING_KEY entries.
                        json = json.replace(new RegExp(`"MISSING_KEY"`, 'g'), "MISSING_KEY");

                        if(!isCI)
                            fs.writeFileSync(`${ TRANSLATION_ROOT_PATH }${ language }.json`, json);
                    }
                }
            );
        }

        return promise.then(
            () => {
                if(foundErrors) {
                    return Promise.reject("Errors found");
                }
            }
        )
    }
).then(
    () => {
        console.log("Done!");
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);

/**
 * Compares the two languages. The keys of the base language are iterated
 * and if the found key is missing in the other language this is marked as an error.
 * @param {*} baseLanguage 
 * @param {*} otherLanguage 
 */
function compareLanguages(baseLanguage, otherLanguage, otherLanguageName) {
    return compareObjects(baseLanguage, otherLanguage, otherLanguageName, "");
}

function compareObjects(from, to, toName, propertyPrefix) {
    let errors = [];

    for(let key in from) {
        let fromValue = from[key];
        let toValue = to[key];

        let toValueIsUndefined = toValue === null || toValue === undefined; 

        if(typeof(fromValue) === "object") {
            if(toValueIsUndefined) {
                toValue = {};
                to[key] = toValue;
            }

            errors = errors.concat(compareObjects(fromValue, toValue, toName, `${ propertyPrefix }${ propertyPrefix.length > 0 ? "." : "" }${ key }`))
        }
        else {
            if(toValueIsUndefined) {
                // List error
                errors.push(
                    `'${ propertyPrefix }${ propertyPrefix.length > 0 ? "." : "" }${ key }' is missing from translation '${ toName }'`
                );
                to[key] = "MISSING_KEY";
            }
        }
    }

    return errors;
}

/**
 * Retrieves a list of available languages.
 */
function getAvailableLanguages() {
    return new Promise((resolve, reject) => {
        fs.readdir(TRANSLATION_ROOT_PATH, (error, files) => {
            if(!error) {
                // Filter files with wrong extensions
                files = files.filter(x => x.endsWith(".json"));

                // Strip extension
                files = files.map(x => x.substr(0, x.length - 5));

                resolve(files);
            }
            else {
                reject(error);
            }
        });
    });
}

/**
 * Reads the file at the given path as JSON.
 * 
 * The parsed JSON object will be returned.
 */
function readJSONFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if(!error) {
                let obj;
                try {
                    // Try and parse the file as JSON
                    obj = JSON.parse(data.toString());
                }
                catch(ex) {
                    // Could not pare as JSON
                    reject(ex);
                    return;
                }

                resolve(obj);
            }
            else {
                // Could not read file
                reject(error);
            }
        });
    });
}