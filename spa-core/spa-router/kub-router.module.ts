import {ISPARouter} from "./spa-router.interface";

// @singleton
export class KUBRouter implements ISPARouter
{
    public static createRouter(delegate: (newRoute: string) => void): KUBRouter {
        if (KUBRouter._instance_) return KUBRouter._instance_;
        KUBRouter._instance_ = new KUBRouter(delegate);
        
        return KUBRouter._instance_;
    };

    private static _instance_: KUBRouter
    private _currentRoute_: string;
    private _delegateCallback_: (newRoute: string) => void;

    private constructor(delegate: (newRoute: string) => void) {
        
        this._routingCycle_ = this._routingCycle_.bind(this);
        this._currentRoute_ = '';
        this._delegateCallback_ = delegate;
    };

    public startRouting(): void {

        this._currentRoute_ = window.location.pathname;
        this._routingCycle_();
    };

    private _routingCycle_(): void {
        
        if (window.location.pathname !== this._currentRoute_) {
            this._currentRoute_ = window.location.pathname;
            this._delegateCallback_(this._currentRoute_);
        };

        requestAnimationFrame(this._routingCycle_);
    };
}