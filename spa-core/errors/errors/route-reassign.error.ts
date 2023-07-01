
export class RouteReassign extends Error{
    constructor(route: string, fromPageName: string, toPageName: string) {
        super(`Routes reassign is prohibited. Route reassign '${route}' from page ${fromPageName} to page ${toPageName}`)
    };
};