"use strict";

import * as ko from "knockout";
import "ojs/ojknockout";
import componentStrings = require("ojL10n!./resources/nls/list-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import ArrayDataProvider = require("ojs/ojarraydataprovider");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    messageText: ko.Observable<string>;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    menuDataProvider: ArrayDataProvider<number, { id: number; label: string }>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;

        this.messageText = ko.observable("Hello from list-component");
        this.properties = context.properties;
        this.res = componentStrings["list-component"];

        this.menuDataProvider = new ArrayDataProvider(
            this.properties.listData.map((item: string, index: number) => ({
                id: index,
                label: item
            })),
            { keyAttributes: "id" }
        );

        // Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }

    // Lifecycle methods - implement if necessary 

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };
};