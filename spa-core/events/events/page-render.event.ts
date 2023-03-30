import { KUBPageType } from "../../types/core-types.type";
import { IKUBPage } from "../../spa-page";
import { IPageRenderEvent } from "../events.intefaces";

export class PageRenderEvent implements IPageRenderEvent{
    constructor(
        public route: string,
        public pageToBeRemoved: IKUBPage,
        public pageToBeRendered: KUBPageType,
        public alreadyVisitedSite: boolean,
        public preventRendering: () => void) {}
};