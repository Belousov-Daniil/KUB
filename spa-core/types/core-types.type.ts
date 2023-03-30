import { IKUBPage } from "../spa-page"

export type KUBPageType = new (mountPoint: HTMLElement) => IKUBPage

export interface AppSession {
    appAlreadyVisited: boolean,
    pageAlreadyVisited: boolean,
}