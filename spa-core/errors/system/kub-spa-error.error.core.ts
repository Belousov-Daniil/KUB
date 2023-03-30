import KUBErrorScreen from "./kub-error-screen/kub-error-screen.interface.core"

export default class KUBSPAError extends Error {
    constructor(erorrname: string, message: string) {
        super(message)
        document.body.appendChild(KUBErrorScreen(erorrname, message))
    };
}