import { IPageNotFoundEvent } from "../events.intefaces"

export class PageNotFoundEvent implements IPageNotFoundEvent{

    public goBack(): void {
        window.history.back()
    };
    public goTo(route: string): void {
        window.history.pushState(undefined, '', route)
    };
    public constructor(
        public currentRoute: string,
        public preventRendering404: () => void) {}
}