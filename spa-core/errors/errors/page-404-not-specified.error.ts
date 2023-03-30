import KUBSPAError from "../system/kub-spa-error.error.core";


export class Page404NotSpecified extends KUBSPAError{
    constructor() {
        super(Page404NotSpecified.name, `Page 404 not specified`);
    };
};