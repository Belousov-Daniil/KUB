
// @imports(system styling)
import desktopStyling from './style-sheets/desktop-layer.module.css';
// @imports(events)
import { IPageRenderEvent, IPageNotFoundEvent } from './events';
import { PageNotFoundEvent, PageRenderEvent } from './events';
// @imports(errors)
import { RouteReassign, Page404NotSpecified } from "./errors";
// @modules-iterfaces
import { ISPARouter } from "./spa-router";
// @coretypes
import { KUBPageType } from './types/core-types.type';
import { IKUBPage } from './spa-page';
// @modules
import { KUBRouter } from "./spa-router";

// @typeclass
class KUBAppsession {
    public alreadyVisited: boolean = false;
    public currentRoute: string = '';
    public renderedPage!: IKUBPage;
};

// @packagemain
// @pattern(singleton, final)
export class KUBApplication
{
    // @staticproperty
    private static _instance_?: KUBApplication;

    // @staticproperty
    private static APP_WINDOW: HTMLElement = document.createElement('div');
    // @getter
    public static GET_APP_WINDOW(): HTMLElement {
        return KUBApplication.APP_WINDOW
    };

    // @staticproperty
    private static DESKTOP_LAYER: HTMLElement = (() => {
        const root: HTMLElement = document.createElement('div');
        root.className = desktopStyling.DesktopLayer;
        return root
    })();
    // @getter
    public static GET_DESKTOP_LAYER(): HTMLElement {
        return this.DESKTOP_LAYER
    }
    
    // @UpperLevelAPI
    // @constructor
    public static createApp(): KUBApplication {
        if (KUBApplication._instance_) return KUBApplication._instance_
        
        KUBApplication._instance_ = new KUBApplication()
        return KUBApplication._instance_
    };
    private constructor() {
        
        // 1. @section(Views)
        this.appWindow = KUBApplication.APP_WINDOW;
        this.desktopLayer = KUBApplication.DESKTOP_LAYER;

        // 2. @section(Pages and routing)
        this.appPages = new Map();
        this._RouterDelegate_ = this._RouterDelegate_.bind(this);
        this.router = KUBRouter.createRouter(this._RouterDelegate_);
        
        // 3. @section(session and process)
        this.session = new KUBAppsession();

        // 4. @section(Mounting)
        document.body.append(this.appWindow, this.desktopLayer);
    };
    

    // @property
    private readonly appWindow: HTMLElement;
    // @getter
    public GET_APPLICATION_VIEW_ROOT(): HTMLElement {
        return this.appWindow
    };

    // @property
    private readonly desktopLayer: HTMLElement;

    // @property
    private readonly router: ISPARouter;

    // @property
    private readonly appPages: Map<string, KUBPageType>;

    // @property
    private page404?: KUBPageType = undefined;
    // @setter
    public setPage404(page404: KUBPageType): void {
        this.page404 = page404;
    };

    // @storage
    private readonly SYS_VALUES = {
        
        VISITED_FLAG: {
            key: 'ALREADY_VISITED',
            value: 'TRUE'
        },
    };

    // @property
    private readonly session: KUBAppsession;


    // @delegatecallback
    private _RouterDelegate_(newRoute: string): void {
        
        this.onRouteChange(newRoute);
        const newPage = this.appPages.get(newRoute);

        if (!newPage) {
            let render404flag: Boolean = true;
            this.onPageNotFound(new PageNotFoundEvent(newRoute, () => {render404flag = false}));
            if (render404flag) { 
                if (!this.page404) throw new Page404NotSpecified();
                this.SWAP_PAGE_CALL(this.page404);
                return;
            };
            return;
        };
        
        let preventRender: boolean = false
        this.onPageRender(new PageRenderEvent(newRoute, this.session.renderedPage, newPage, this.session.alreadyVisited, () =>{preventRender = true}))

        if (!preventRender) this.SWAP_PAGE_CALL(newPage);
        return;
    };

    // @syscall
    private SET_VISITED_FLAG(): void {
        window.sessionStorage.setItem (
            this.SYS_VALUES.VISITED_FLAG.key,
            this.SYS_VALUES.VISITED_FLAG.value );
        
        return;
    };
    // @syscall
    private LOAD_VISITED_FLAG(): boolean {
        return !!window.sessionStorage.getItem(this.SYS_VALUES.VISITED_FLAG.key)
    };
    // @syscall
    private SWAP_PAGE_CALL(toPage: KUBPageType) {
        const newPage = new toPage(this.appWindow);
        const oldPage = this.session.renderedPage;
        this.session.renderedPage = newPage;
        this.decorateSwapPages(oldPage, newPage);
    };
    // @syscall
    private LOAD_SESSION(): void {
        const path: string = window.location.pathname;
        this.session.currentRoute = path;
        this.session.alreadyVisited = this.LOAD_VISITED_FLAG();
    
        if (!this.appPages.has(path)) {
            let render404flag: boolean = true;
            this.onPageNotFound(new PageNotFoundEvent(path, () => {render404flag = false}));

            if (render404flag) {
                if (!this.page404) { throw new Page404NotSpecified() };
                this.session.renderedPage = new this.page404(this.appWindow);
                this.session.renderedPage.RenderPage();
                return;
            };
            return;
        };

        const startingPage = this.appPages.get(path)!
        this.session.renderedPage = new startingPage(this.appWindow);
        this.session.renderedPage.RenderPage();
        return;
    };

    // @UserAPI
    public launchApp(): void {
        this.LOAD_SESSION();
        this.router.startRouting();
        console.log(this.session.alreadyVisited);
        this.SET_VISITED_FLAG();
    };
    // @UserAPI
    public configurePage(route: string, pageToRender: new (props?: any) => IKUBPage): void {
        if (this.appPages.has(route)) throw new RouteReassign(route, this.appPages.get(route)!.name, pageToRender.name);
        this.appPages.set(route, pageToRender);
    };
    // @UserAPI
    public renderOnDesktop(...views: HTMLElement[]): void {
        this.desktopLayer.append(...views)
    };


    // @decorator
    public decorateSwapPages: (previosPage: IKUBPage, nextPage: IKUBPage) => Promise<void>
    = (previosPage: IKUBPage, nextPage: IKUBPage): Promise<void> => {
        previosPage.RemovePage()
        .then(() => { nextPage.RenderPage() });
        return Promise.resolve();
    };


    // @event
    public onRouteChange: (newRoute: string) => void = () => undefined
    // @event
    public onPageRender: (event: IPageRenderEvent) => void = () => undefined
    // @event
    public onPageNotFound: (event: IPageNotFoundEvent) => void = () => undefined
    // @event
    public onLaunch: VoidFunction = () => undefined
    // @event
    public onFirstRender: VoidFunction = () => undefined
};