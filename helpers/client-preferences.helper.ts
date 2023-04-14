

export interface ClientLanguages {
    readonly current: Lowercase<string>,
    readonly possible: readonly string[],
}
/**
 * #### Returns current client language
 * Returned interface:
 * 
 * @property `current: string` *holds current user languages in format: 2 first letters in lowercase*
 * @property `possible: readonly string[]` holds all possible client languages
 */
export function inspectLang(): ClientLanguages {
    return {
        current: window.navigator.language.slice(0,2).toLocaleLowerCase() as Lowercase<string>,
        possible: window.navigator.languages,
    };
};


export type Theme = "dark" | "light"
/**
 * #### Returns current client theme
 * 
 * *Version with string return type*
 * @returns Theme: string = "dark" | "light"
*/
export function inspectThemeStr(): Theme {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};


/**
 * #### Returns current client theme
 * 
 * *Version with boolean return type*
 * @returns boolean
 * @true current theme is dark
 * @false current theme is light
 */
export function inspectThemeBool(): boolean {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false;
};


export interface ThemeChangesDispatcher {
    readonly kill: () => void,
    readonly onChange: (callback: (isDark: boolean) => void) => void
};
/**
 * #### Create event dispatcher object that listens for client theme changes
 * Returned interface:
 * 
 * @function `kill(): void` *kills dispatcher and stops (not pauses) listening for theme changes*
 * @function `onChange(callback: (isDark: boolean) => void): void` *setter for changing callback, executed on theme change, isDark - changed to (current) theme*
 */
export function dispatcherThemeChange(onChangeCallback: (isDark: boolean) => void = () => undefined): ThemeChangesDispatcher {
    
    const target = window.matchMedia('(prefers-color-scheme: dark)');
    const executor = (event: MediaQueryListEvent) => {
        onChangeCallback(event.matches)
    };

    target.addEventListener("change", executor)
    return {
        kill(): void {
            target.removeEventListener("change", executor)
        },
        onChange(callback: (isDark: boolean) => void) {
            onChangeCallback = callback
        },
    };
};