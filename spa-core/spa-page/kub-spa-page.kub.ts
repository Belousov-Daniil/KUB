import {KUBApplication} from "../kub-spa-application.kub";
import {IKUBPage} from "./kub-spa-page.interface";

// @pattern(abstract)
export abstract class KUBPage implements IKUBPage
{
    protected constructor() {
        this.pageViewRoot = document.createElement('div');
        this.mountPoint = KUBApplication.GET_APP_WINDOW()
    };

    // @property
    private readonly mountPoint: HTMLElement;
    // @property
    protected readonly pageViewRoot: HTMLElement;
    // @getter
    public getViewRoot(): HTMLElement {
        return this.pageViewRoot;
    };
    
    // @description(Renders page to the mount point)
    // @events(onBeforeRender, onAfterRender, renderCallback)
    public async RenderPage(callback = () => undefined): Promise<void> {
        await this.onBeforeRender();
        this.mountPoint.appendChild(this.pageViewRoot);
        callback();
        this.onAfterRender();
    };

    protected onBeforeRender: () => Promise<void> = function() {
        return Promise.resolve();
    };

    protected onAfterRender: () => void = function() {
        return undefined;
    };

    // @description(Removes page from application)
    // @events(onBeforeRemove, onAfterRemove, removeCallback)
    public async RemovePage(callback = () => undefined): Promise<void> {
        await this.onBeforeRemove();
        this.pageViewRoot.remove();
        callback();
    };

    protected onBeforeRemove: () => Promise<void> = function() {
        return Promise.resolve();
    };
};
