/**
 * ### Optimized "tsx-like" syntatic-sugar abstraction for creating nodes in vanilla way
 * Why i need to return value? - Becasue of optimisation
 * @param decorator - function where you "decorate" div node
 * @returns HTMLElement
 */
export function Div(decorator: (node: HTMLElement) => HTMLElement): HTMLElement {
    return decorator(document.createElement("div"));
};