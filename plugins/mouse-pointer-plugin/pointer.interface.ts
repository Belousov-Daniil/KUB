
export interface GUIPointer {
    display(): void,
    remove(): void,
    show(): void,
    hide(): void,
    insertToPointerRoot(...views: HTMLElement[]): void,
};

export interface GUIPointersContructor {
    createGUIPointer: (pointer_marker: string, x_delta?: number, y_delta?: number) => GUIPointer,
};