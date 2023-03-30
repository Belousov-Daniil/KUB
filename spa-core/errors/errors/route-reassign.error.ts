import KUBSPAError from "../system/kub-spa-error.error.core";


export class RouteReassign extends KUBSPAError{
    constructor(route: string, fromPageName: string, toPageName: string) {
        super(RouteReassign.name, `Tried assign route ${route} to ${toPageName}, but is already assigned to ${fromPageName}`);
    };
};