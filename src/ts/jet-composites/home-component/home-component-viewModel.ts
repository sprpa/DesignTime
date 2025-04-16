"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/home-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    messageText: ko.Observable<string>;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    loader: ko.Observable<boolean>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;
        this.messageText = ko.observable("Login Page");
        this.properties = context.properties;
        this.res = componentStrings["home-component"];

        this.loader = ko.observable(false);

        this.busyResolve();
    }

    onStartClick = async (): Promise<void> => {
        try {
            const response = await fetch("http://10.26.1.52:5150/generate-login-url", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            const data = await response.json();
            if (data?.result) {
                window.location.href = data.result;
            }

        } catch (error) {
            console.error("Login Auth Error:", error);
        }
    };

    // Lifecycle methods - implement if necessary 
    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };
    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };
    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };
    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };
    disconnected(element: Element): void { };
};