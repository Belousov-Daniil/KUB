Event-driven typescript frontend framework created for multipage SPA


# Application

`KUBApplication` class - A SPA client app instance.

### API
#### Controllers

- Create new App
`createApp(): KUBApplication`

- Start App
`launchApp(): void`

- Render elements on top static layer
`renderOnDesktop(...views: HTMLElement[]): void`

#### Configuration

- Configure new route on a client side
`configurePage(route: string, pageToRender: new (props?: any) => IKUBPage): void`

- Configure 404/not-found page on a client side
`setPage404(page404: KUBPageType): void`

- Callback for decorating how pages will swap
`decorateSwapPages: (previosPage: IKUBPage, nextPage: IKUBPage) => Promise<void>`

#### Events

- Fired when path changes 
`onRouteChange: (newRoute: string) => void = () => undefined`

- Fired when new page renders
`onPageRender: (event: IPageRenderEvent) => void = () => undefined`

- Fired when page for requested path on client side was not found
`onPageNotFound: (event: IPageNotFoundEvent) => void = () => undefined`

- @depracated
`onLaunch: VoidFunction = () => undefined`

- @depricated
`onFirstRender: VoidFunction = () => undefined`

#### System

- Get application view
`static GET_APP_WINDOW(): HTMLElement`

- Get desktop layer view
`static GET_DESKTOP_LAYER(): HTMLElement`


# Pages

`KUBPage` abstract class - client app page

## API

- Render page to the App
`async RenderPage(callback = () => undefined): Promise<void>`

- Remove page from the App
`async RemovePage(callback = () => undefined): Promise<void>`

- Get page root element
`getViewRoot(): HTMLElement`

### Events

- Do before being mounted to the screen
`protected onBeforeRender: () => Promise<void>`

- Do when page is rendered to the screen
`protected onAfterRender: () => void`

- Do before page being removed from the screen
`protected onBeforeRemove: () => Promise<void>`


# Plugins

@under-rewrite

# Helpers

@under-rewrite