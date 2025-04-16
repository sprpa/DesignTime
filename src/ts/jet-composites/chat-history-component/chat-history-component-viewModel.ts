
"use strict";

import "ojs/ojknockout";
import componentStrings = require("ojL10n!./resources/nls/chat-history-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import ko = require("knockout");
import 'ojs/ojaccordion';
import 'ojs/ojtreeview';
import ArrayTreeDataProvider = require("ojs/ojarraytreedataprovider");
import * as KnockoutTemplateUtils from 'ojs/ojknockouttemplateutils';
import Router = require("ojs/ojrouter");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };
    categories: ko.ObservableArray<any> = ko.observableArray<any>([]);
    // selectedItem: ko.Observable<string | null>; // Track selected item
    selectedItem: ko.Observable<any>; // Track selected item
    treeDataProvider: ko.Observable<any> = ko.observable();
    tooltipText = ko.observable("");


    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;
        this.properties = context.properties;
        this.res = componentStrings["chat-history-component"];


        // Convert to TreeDataProvider

        this.selectedItem = ko.observable(null);
        // Assign the function after declaration
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.handleSelection = this.handleSelection.bind(this);

        this.getIntialContent();



        // Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }


    checkOverflow(event: MouseEvent) {
        const targetElement = event.currentTarget as HTMLElement;
        const tooltip = targetElement.nextElementSibling as HTMLElement;

        if (targetElement.offsetWidth < targetElement.scrollWidth) {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        }
    }

    hideTooltip(event: MouseEvent) {
        const targetElement = event.currentTarget as HTMLElement;
        const tooltip = targetElement.nextElementSibling as HTMLElement;
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }

    onClickClose(): void {
        const event = new CustomEvent("buttonToggle", {
            detail: { flag: false },
            bubbles: true
        });
        this.composite.dispatchEvent(event);
    }
    toggleAccordion(category: { isOpen: ko.Observable<boolean> }): void {
        category.isOpen(!category.isOpen()); // Toggle accordion visibility
    }

    /**
     * Handles selection event and finds the selected node
     */
    // handleSelection(event: { detail: { value: Set<unknown> } }) {
    //     let selectedSet = event.detail.value;
    //     let selectedIds = Array.from(selectedSet.values()); // Convert Set to Array

    //     if (selectedIds.length > 0) {
    //         let selectedId = selectedIds[0] as string; // ✅ Explicitly cast to string
    //         let selectedNode = this.findNodeById(this.categories(), selectedId);

    //         this.selectedItem(selectedNode);
    //         console.log("Selected Node Data:", selectedNode);

    //         // Dispatch custom event with selected node data
    //         const selectionEvent = new CustomEvent("selectedvalues", {
    //             detail: selectedNode,
    //             bubbles: true
    //         });
    //         this.composite.dispatchEvent(selectionEvent);
    //     }
    // }



    handleSelection(event: { detail: { value: Set<unknown> } }) {
        let selectedSet = event.detail.value;
        let selectedIds = Array.from(selectedSet.values()); // Convert Set to Array
        let selectedTitles = ""
        let flag  = []

        if (selectedIds.length > 0) {
            let selectedId = selectedIds[0] as string; // ✅ Explicitly cast to string
            let selectedNode = this.findNodeById(this.categories(), selectedId);

            this.selectedItem(selectedNode);
            // console.log("Selected Node Data:", selectedNode);
            // Router.sync().then(() => {
            //     console.log("Router re-synced!");
            // });

            if (selectedId) {
                let path = this.findNodePath(this.categories(), selectedId);
                
                if (path) {
                    let selectedFlag = path.map(node => node.flag);
                    flag =selectedFlag
                    let titles = path.map(node => node.title).join(" > "); // Format as breadcrumb
                    selectedTitles = titles


                    // console.log("Selected Path:", titles);
                }
            }

            // Dispatch custom event with selected node data
            const selectionEvent = new CustomEvent("selectedvalues", {
                detail: selectedNode,
                bubbles: true
            });
            this.composite.dispatchEvent(selectionEvent);

            const selectionBreadCrumb = new CustomEvent("selectedBread", {
                detail: { 
                    selectedTitles, 
                    flag: flag || ''  // Ensure flag is properly set
                },  
                bubbles: true
            });
            this.composite.dispatchEvent(selectionBreadCrumb);
            
            
        }
    }


    /**
     * Recursively finds a node in the tree by ID
     */
    findNodeById(nodes: any[], id: string): any | null {
        for (let node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                let result: any | null = this.findNodeById(node.children, id);
                if (result) return result;
            }
        }
        return null;
    }


    findNodePath(nodes: any[], id: string, path: any[] = []): any[] | null {
        for (let node of nodes) {
            let newPath = [...path, node]; // Keep track of the path

            if (node.id === id) {
                return newPath; // Return full path when the node is found
            }

            if (node.children && node.children.length > 0) {
                let result = this.findNodePath(node.children, id, newPath);
                if (result) return result; // If found in children, return the path
            }
        }
        return null; // Return null if not found
    }




    getIntialContent = async () => {
        try {
            const response = await fetch("http://10.26.1.52:5003/tree", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const finalResponse = await response.json();

            if (Array.isArray(finalResponse)) {
                this.categories(finalResponse);
                this.treeDataProvider(
                    new ArrayTreeDataProvider(this.categories(), {
                        keyAttributes: "id",
                        childrenAttribute: "children",
                    })
                );

            } else {
                throw new Error("Invalid response format: Expected an array.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    // handleSelection(data: any, event: Event): void {


    //     if (!data.children || data.children.length === 0) {
    //         this.selectedItem(data); // Only select if it's a leaf node (child)
    //         console.log("Selected Child Item:", data);
    //     } else {
    //         console.log("Parent Item Clicked (Not Selecting):", data);
    //     }

    //     const diagrams = new CustomEvent("selectedvalues", {
    //         detail: data,
    //         bubbles: true
    //     });
    //     this.composite.dispatchEvent(diagrams);
    // }


    // Lifecycle methods - implement if necessary 

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void {


    };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };
};