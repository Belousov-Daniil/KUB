import styling from './kub-error-screen.style.module.css'

export default function KUBErrorScreen(errorName: string, errorMessage: string): HTMLElement
{
    const root: HTMLElement = document.createElement('div')
    root.className = styling.ROOT;

    const errorWidget: HTMLElement = document.createElement('div')
    errorWidget.className = styling.WIDGET
    errorWidget.innerHTML = `
        <div>${errorName}</div>
        <div>${errorMessage}</div>`

    root.appendChild(errorWidget)
    
    return root
}
