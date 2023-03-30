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


// @documentation(Pages rendering)
/*
 *  1. App receives from internal session storage page class to be rendered by route.

 *  2. App removes previous page, by calling page.RemovePage():
 *      - onBeforeRemove() - before being removed from the app window (page internal function)
 *      - page root being removed
 *      - afterRemove() - page totally removed from the app window (page internal function)
 *      - removeCallback() - same but public
 * 
 *  3. App renders new page:
 *      - App creates new instance of the page - all page contruction is being processed within contructor.
 *      - App calls page.RenderPage()
 *      - onBeforeRender() - before page root being attached to the app window
 *      - page being rendered to the app pages layer
 *      - onAfterRender() - page already attached to the app window
 * 
 *  Final:
 *      - Prev page removed
 *      - New page rendered
 */