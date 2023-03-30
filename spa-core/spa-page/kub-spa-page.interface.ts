
export interface IKUBPage {

    RenderPage(): Promise<void>;
    RemovePage(): Promise<void>;
    getViewRoot(): HTMLElement;
}