"use strict";

import * as ko from "knockout";
import 'ojs/ojaccordion';
import "ojs/ojknockout";
import 'ojs/ojlabel';
import 'ojs/ojradioset';
import 'ojs/ojtable';
import componentStrings = require("ojL10n!./resources/nls/accordion-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    accordionData: ko.ObservableArray<any>;
    selectedAccordionId = ko.observable("");

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;
        this.res = componentStrings["accordion-component"];

        this.properties = context.properties;

        // Observable for accordion data
        this.accordionData = ko.observableArray(this.properties.data);

        this.busyResolve();
    }

    // Function to convert index to A, B, C...
    getLetterFromIndex(index: number): string {
        return String.fromCharCode(65 + index); // 65 = 'A', 66 = 'B', etc.
    }

    handleAccordionHeaderDblClick = (item: any, event: any) => {
        const id = item.data?.id;
        // Save selected ID
        this.selectedAccordionId(id);

        // Get all accordion data (unwrap observable)
        const allData = this.accordionData();

        // Find the matching item by ID
        const selectedData = allData.find((obj: any) => obj.id === id);

        if (selectedData) {
            const diagrams = new CustomEvent("selectedAccordion", {
                detail: { flag: selectedData },
                bubbles: true
            });
            this.composite.dispatchEvent(diagrams);
        } else {
            console.warn("No data found for ID:", id);
        }
    };



    //Lifecycle methods - implement if necessary 

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };
};