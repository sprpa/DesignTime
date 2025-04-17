"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/gs-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";
import 'ojs/ojbutton';
import { ojMenu } from "ojs/ojmenu";

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    messageText: ko.Observable<string>;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };
    accordionData: ko.Observable<any>;
    menuTitle: ko.Observable<string>;
    selectedMenuTitle: ko.Observable<any>;
    breadcrumbs = ko.observableArray<string>([]);
    firstList = ko.observableArray<string>([]);
    lastItem = ko.observable<string>("");
    isYamlMenuVisible = ko.observable(false);
    loader: ko.Observable<any> = ko.observable()
    messagePrompt: ko.Observable<any>;
    responseBind: ko.Observable<any> = ko.observable()
    selectedOption = ko.observable<string>("java");
    finalOutPut: ko.Observable<any> = ko.observable()


    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);

        this.composite = context.element;

        //Example observable
        this.messageText = ko.observable("Hello from gs-component");
        this.properties = context.properties;
        this.res = componentStrings["gs-component"];
        this.getIntialContent()
        this.accordionData = ko.observable()

        this.selectedMenuTitle = ko.observable(this.properties.titles)
        this.messagePrompt = ko.observable(this.properties.message)
        console.log(this.messagePrompt())
        this.CreateSolution(this.messagePrompt())
        console.log(this.responseBind())

        this.updateBreadcrumbs(this.selectedMenuTitle());
        this.menuTitle = ko.observable(context.properties.selected || ""); // Initialize with selected value


        //Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }

    handleMenuAction = (event: ojMenu.ojMenuAction) => {
        const selectedValue = event.detail.selectedValue;
        this.selectedOption(selectedValue);
    
        switch (selectedValue) {
          case 'java':
            this.finalOutPut(this.responseBind().java_code);
            break;
    
          case 'yaml':
            this.finalOutPut(this.responseBind().yaml_output);
            break;
    
          case 'prs':
            this.finalOutPut(this.responseBind().prescriptive_text);
            break;
    
          default:
            // Fallback to prs if no match
            this.finalOutPut(this.responseBind().prescriptive_text);
        }
    };
    
    CreateSolution = async (message: any) => {

        // let finalResponse =
        this.loader(true);


        const payload = {
            "message": message
        }


        try {
            const response = await fetch("http://10.26.1.52:8010/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            let finalResponse;
            try {
                finalResponse = await response.json();
                console.log(finalResponse)
                this.responseBind(finalResponse)


                // this.keyAttribute(finalResponse?.TableKeyAttributes)
                // this.pushArrayName(finalResponse?.push_array_name)


                // this.nextSteps(finalResponse.nextStep);
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server.");
            }

            // Add bot's response to chat
            // this.messages.push(finalResponse);

        } catch (error) {
            console.error("Error sending query:", error);
        } finally {
            this.loader(false);
        }
    };


    // //Lifecycle methods - implement if necessary 
    // toggleSideMenu = () => {
    //     this.isYamlMenuVisible(!this.isYamlMenuVisible());

    //     const selectionYAML = new CustomEvent("selectedYaml", {
    //         detail: {
    //             flag: this.isYamlMenuVisible()
    //         },
    //         bubbles: true
    //     });
    //     this.composite.dispatchEvent(selectionYAML);
    // };




    updateBreadcrumbs(parts: string[]) {
        if (parts.length === 0) return;

        this.firstList(parts.slice(0, -1));
        this.lastItem(parts[parts.length - 1]);
    }


    getIntialContent = async () => {
        try {
            const response = await fetch("http://10.26.1.52:5006/get-stack-structure", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // ✅ Convert body to JSON string
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const finalResponse = await response.json();
            this.accordionData(finalResponse)

            return finalResponse; // ✅ Ensure function returns data

        } catch (error) {
            console.error("Error fetching data:", error);
            return null; // ✅ Return null on error to avoid undefined issues
        }
    };

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void {

    };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void {

    };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void {

    };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void {

    };

    disconnected(element: Element): void {

    };
};