export function inspectLang(): {current: Lowercase<string>, possible: readonly string[]} {
    return {
        current: window.navigator.language.slice(0,2).toLocaleLowerCase() as Lowercase<string>,
        possible: window.navigator.languages,
    };
};