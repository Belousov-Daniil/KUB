import { GUIPointer, GUIPointersContructor } from "./pointer.interface";
import staticStyling from "./plugin-static-styling.style.module.css"

//pattern(Interface)
export class GUIUserPointerPlugin implements GUIPointer {

    // @PluginInterface
    // @pattern(Proxy)
    public static getGUIPointersConstructor(pointersGUILayer: HTMLElement): GUIPointersContructor {
        return {
            createGUIPointer: function(pointer_marker: string, x_delta: number = 0, y_delta: number = 0): GUIPointer {
                return new GUIUserPointerPlugin(pointersGUILayer, pointer_marker, x_delta, y_delta)
            },
        };
    };

    private constructor(pointersGUILayer: HTMLElement, pointer_marker: string, x_delta: number = 0, y_delta: number = 0) {

        // bind methods
        this.display = this.display.bind(this);
        this.remove = this.remove.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        // save context for RAF loop
        const context = this;
        let renderStopFlag: number = 0;

        // initiate pointer's GUI
        const root = document.createElement('div');

        this.pointerGUIRoot = root;
        root.classList.add(staticStyling.GUIPointerPlugin_static);
        this.GUILayer = pointersGUILayer;
        
        // pointer GUI variables
        let cS: string | null = null;
        let rS: string | null = null;
        let x: number = 0;
        let y: number = 0;

        // rendering loop
        function render(): void {
            if(rS !== cS) {
                rS = cS;
                context.onStateChange(rS);
            };
            root.style.left = `${x-x_delta}px`;
            root.style.top = `${y-y_delta}px`;
            renderStopFlag = requestAnimationFrame(render);
            return;
        };

        // pointer movement callback
        document.addEventListener('mousemove', (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
            // @ts-ignore
            cS = `${e.target.getAttribute(pointer_marker)}`;
            return;
        });

        this.startRendering = render;
        this.startRendering = this.startRendering.bind(this);

        this.stopRendering = function() {cancelAnimationFrame(renderStopFlag)};
        this.stopRendering = this.stopRendering.bind(this);
    };

    // @sysproperty
    private readonly pointerGUIRoot: HTMLElement;
    private readonly GUILayer: HTMLElement;
    // @sysfunc
    public startRendering: () => void = () => undefined;
    // @sysfunc
    public stopRendering: () => void = () => undefined
    
    
    // @getter
    public pointerClassList(): DOMTokenList {
        return this.pointerGUIRoot.classList
    };
    // @getter
    public pointerStyleList(): CSSStyleDeclaration {
        return this.pointerGUIRoot.style
    };

    // @event
    public onStateChange: (newState: string | null) => void = () => undefined;
    // @vent
    private readonly onStartRendering: () => Promise<void> = () => Promise.resolve();
    // @vent
    private readonly onStopRendering: () => Promise<void> = () => Promise.resolve();

    /**
     * #### Start rendering GUIPointer on screen
     * @description Appends pointer DOM element to the ***Desktop Layer***
     * 
     * *Side-effect function*. returns - void
     */
    
    public display(): void {
        this.GUILayer.appendChild(this.pointerGUIRoot);
        this.onStartRendering().then(this.startRendering)
        return;
    };

    /**
     * #### Stop rendering GUIPointer on screen
     * @description Removes pointer DOM element to the ***Desktop Layer***
     * 
     * *Side-effect function*. returns - void
     */
    public remove(): void {
        this.stopRendering();
        this.onStopRendering().then(this.pointerGUIRoot.remove)
        return;
    };

    /**
     * #### Show GUIPointer from the layer
     * @description Shows pointer DOM element to the ***Desktop Layer***, not appends. Basically a *sintatic sugar* for playing with DOM styling
     * 
     * *Side-effect function*. returns - void
     */
    public show(): void {this.pointerGUIRoot.classList.add(staticStyling.GUI_hide)};
    
    /**
     * #### Hide GUIPointer from the layer
     * @description Hides pointer DOM element to the ***Desktop Layer***, not removes. Basically a *sintatic sugar* for playing with DOM styling
     * 
     * *Side-effect function*. returns - void
    */
    public hide(): void {this.pointerGUIRoot.classList.remove(staticStyling.GUI_hide)};

    /**
     * #### Insert DOM elements to the pointer
     * @description Appends pointer GUI (DOM element) with passed DOM elements
     * 
     * *Side-effect function*. returns - void
    */
    public insertToPointerRoot(...views: HTMLElement[]): void {
        
        function injectStyling(view: HTMLElement): HTMLElement {
            view.style.pointerEvents = 'none';
            view.style.userSelect = 'none';
            return view;
        };
        
        this.pointerGUIRoot.append(...views.map((view) => injectStyling(view)))
    };
};