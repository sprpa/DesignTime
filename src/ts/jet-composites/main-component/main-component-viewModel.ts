"use strict";

import * as ko from "knockout";
import "ojs/ojknockout";
import componentStrings = require("ojL10n!./resources/nls/main-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };
    isChatHistory: ko.Observable<boolean>;
    selectedTitles: ko.Observable<any>
    selectedvalues = ko.observable('Chat');
    selectedAccordionData: ko.Observable<any>
    selectedXmlData: ko.Observable<string>
    previousSelectedTitles = ko.observable("");  // Track previous selection
    shouldRenderGSICategory = ko.observable(false);
    shouldRenderGSICategoryValue = ko.observable(false);
    isSideMenuVisible = ko.observable(true);

    showChatComponent = ko.observable(false);
    breadcrumbs: ko.ObservableArray<any>;
    flag: ko.ObservableArray<any>;
    previousSelectedTitlesValues = ko.observable("");
    shouldRenderGSICategoryChat = ko.observable(false);
    selectedAccordionDataList = ko.observableArray<any>([]);
    selectedYaml: ko.Observable<any>;
    isYamlMenuVisible = ko.observable(false);
    selectedFlag: ko.Observable<any>;
    isMainLayoutVisible: ko.Observable<boolean>;
    userInfo = ko.observable<any>(null);


    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.selectedXmlData = ko.observable("")
        this.composite = context.element;
        this.breadcrumbs = ko.observableArray();
        this.flag = ko.observableArray();
        this.selectedYaml = ko.observable();

        this.isMainLayoutVisible = ko.observable(false);
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        if (code) {
            this.getLoginAuthToken(code);
            this.isMainLayoutVisible(true);
        } else if (access_token && refresh_token) {
            this.isMainLayoutVisible = ko.observable(true);
            console.log("Tokens found in localStorage → showing main layout");
        } else {
            console.log("No tokens or code → redirecting to login...");
        }

        this.properties = context.properties;
        this.res = componentStrings["main-component"];
        this.isChatHistory = ko.observable(false);
        this.selectedTitles = ko.observable("");
        this.selectedAccordionData = ko.observable();
        this.selectedAccordionDataList = ko.observableArray<any>([]);
        this.selectedFlag = ko.observable(false);


        // Listen for the custom event
        context.element.addEventListener("buttonToggle", (event: Event) => {
            const customEvent = event as CustomEvent; // Type cast to CustomEvent
            this.isChatHistory(customEvent.detail.flag); // Access 'detail' safely
            this.isSideMenuVisible(!customEvent.detail.flag); // Access 'detail' safely
        });

        context.element.addEventListener("chatOpen", (event: Event) => {
            const customEvent = event as CustomEvent; // Type cast to CustomEvent
            this.isSideMenuVisible(customEvent.detail.flag); // Access 'detail' safely
            this.isChatHistory(!customEvent.detail.flag); // Access 'detail' safely
        });

        context.element.addEventListener("selectedBread", (event: Event) => {
            const customEvent = event as CustomEvent; // Type cast to CustomEvent

            // Access correct property from detail
            this.selectedTitles(customEvent.detail.selectedTitles);
            this.flag(customEvent.detail.flag.join(", "));

            this.isGSICategory(); // Call function when selection changes

            // ✅ Update breadcrumbs after setting selectedTitles
            this.updateBreadcrumbs(this.selectedTitles());
        });


        context.element.addEventListener("selectedvalues", (event: Event) => {
            const customEvent = event as CustomEvent; // Type cast to CustomEvent
            this.selectedvalues(customEvent.detail.title)
            console.log(customEvent.detail.title);
            this.isSelectedvalues()
        });

        // context.element.addEventListener("selectedYaml", (event: Event) => {
        //     const customEvent = event as CustomEvent; // Type cast to CustomEvent
        //     this.selectedYaml(customEvent.detail.flag)
        //     console.log(this.selectedYaml())

        // });



        context.element.addEventListener("selectedAccordion", (event: Event) => {
            const customEvent = event as CustomEvent;
            const newData = customEvent.detail.flag;

            // Clear and reset chat observable to force re-render
            this.selectedAccordionData(null);
            this.shouldRenderGSICategoryChat(false); // 🔁 Reset chat render

            // Example condition — render only if flag contains 'CHAT' or something similar
            const shouldRenderChat = this.flag().includes("GSI");

            setTimeout(() => {
                this.selectedAccordionData(newData);
                this.selectedAccordionDataList.removeAll(); // Clears the array
                this.selectedAccordionDataList.push(newData); // Then push the new data
                this.shouldRenderGSICategoryChat(shouldRenderChat); // ✅ trigger render
                this.isYamlMenuVisible(false)
                this.isGSICategory();
            }, 0);



            // You can still call isGSICategory() if needed separately
            this.isGSICategory(); // optional, if needed for other purposes
        });

        // Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();


    }

    // Exchanges authorization code for tokens and updates layout visibility
    getLoginAuthToken = async (code: string) => {
        try {
            const response = await fetch(`http://10.26.1.52:5150/callback?code=${code}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",

                },
            });

            const result = await response.json();
            console.log(result)
            const { access_token, refresh_token } = result.token_data;

            if (access_token && refresh_token) {
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);

                // Now show main layo
                this.isMainLayoutVisible(true);

                // Optional: Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
                //this.getLoginUserInfoByAuthToken();
            }
        } catch (error) {
            console.error("Exchange Code Error:", error);
        }
    };

    // Exchanges authorization code for tokens and updates layout visibility
    getLoginUserInfoByAuthToken = async () => {
        try {
            const response = await fetch("http://192.168.12.2:7001/api/users/current/info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "provider": "AUTH0",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                }
            });

            const result = await response.json();
            console.log(result);
            if (result && result.user) {
                this.userInfo(result.user);
                console.log("Role name:", result.user.roles[0]?.roleName);
                let event = new CustomEvent("userDetails", {
                    detail: { userDetails: result.user.roles[0]?.roleName },
                    bubbles: true
                });
                this.composite.dispatchEvent(event);
            }

        } catch (error) {
            console.error("Exchange Code Error:", error);
        }
    };


    toggleSideMenu = () => {
        this.isSideMenuVisible(!this.isSideMenuVisible());
    };

    toggleSideMenuYml = () => {
        this.isYamlMenuVisible(!this.isYamlMenuVisible());
        this.selectedYaml(this.isYamlMenuVisible())

        this.shouldRenderGSICategoryChat(!this.isYamlMenuVisible())
        this.applyDynamicClass()
    };


    // Computed observable for reactive updates

    isSelectedvalues() {
        let currentSelectedValue = this.selectedvalues(); // Get current selected value
        let previousSelectedValue = this.previousSelectedTitlesValues(); // Get previous selected value


        // If no change, do not re-render
        if (currentSelectedValue === previousSelectedValue) {
            console.log("No change detected, not re-rendering.");
            return false;
        }

        // Update the previous value
        this.previousSelectedTitlesValues(currentSelectedValue);

        const valueArray = ["Agent", "WorkFlows", "Entity Model"];
        let shouldRender = valueArray.includes(currentSelectedValue);

        // ✅ Update the observable property for UI binding
        this.shouldRenderGSICategoryValue(false);
        setTimeout(() => {
            this.shouldRenderGSICategoryValue(shouldRender);
        }, 0);
        return shouldRender;
    }

    updateBreadcrumbs(newSelected: string) {
        if (!newSelected) return; // Avoid errors on empty values
        let parts = newSelected.split(" > "); // Split by ">"
        this.breadcrumbs(parts); // ✅ Update with new values

    }


    // updateGSICategoryRendering(currentSelected: string) {
    //     let previousSelected = this.previousSelectedTitles();  // Get last selection

    //     console.log("Previous Selected:", previousSelected);
    //     console.log("Current Selected:", currentSelected);

    //     if (currentSelected === previousSelected) {
    //         console.log("No change detected, not re-rendering gs-component.");
    //         this.shouldRenderGSICategory(false);
    //         return;
    //     }

    //     // Update previous selection
    //     this.previousSelectedTitles(currentSelected);

    //     // ✅ Set observable to true only if "GSI" is in path
    //     let shouldRender = currentSelected.includes("GSI");
    //     console.log("Change detected, rendering gs-component:", shouldRender);
    //     this.shouldRenderGSICategory(shouldRender);
    // }

    // async getResponse(value: any) {
    //     const payload = {
    //         "id": "DIA001",
    //         "type": value
    //     };
    //     try {
    //         const response = await fetch(`http://10.26.1.52:5005/get-diagram`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Server error: ${response.status} ${response.statusText}`);
    //         }

    //         let finalResponse;
    //         try {
    //             finalResponse = await response.json();
    //             this.selectedvalues(value);
    //             this.selectedXmlData(finalResponse[0].data);
    //         } catch (jsonError) {
    //             this.selectedvalues(value); // Access 'detail' safely
    //             this.selectedXmlData("");
    //             throw new Error("Invalid JSON response from server.");
    //         }
    //         return finalResponse; // ✅ Return the response for further processing

    //     } catch (error) {
    //         console.error("Error sending query:", error);
    //         this.selectedvalues(value); // Access 'detail' safely
    //         this.selectedXmlData("");

    //         return null;
    //     }
    // }

    isGSICategory() {
        let currentSelected = this.selectedTitles(); // Current selection

        let previousSelected = this.previousSelectedTitles(); // Previous selection

        if (currentSelected === previousSelected) {
            console.log("No change detected, not re-rendering gs-component.");
            return { selected: currentSelected, shouldRender: false };
        }

        // ✅ Ensure Knockout detects the change explicitly
        this.previousSelectedTitles(currentSelected);
        this.previousSelectedTitles.valueHasMutated();
        this.selectedAccordionData([]);
        let shouldRender = this.flag().includes("GSI");
        this.selectedFlag(shouldRender);

        // ✅ Force UI refresh using observable
        this.shouldRenderGSICategory(false);
        this.shouldRenderGSICategoryChat(false);
        setTimeout(() => {
            this.shouldRenderGSICategory(shouldRender);
            this.shouldRenderGSICategoryChat(shouldRender);
        }, 0);

        console.log("Change detected, rendering gs-component:", shouldRender);
        return { selected: currentSelected, shouldRender };
    }


    applyDynamicClass() {
        let dynamicClass = "";

        if (this.isChatHistory() && this.isSideMenuVisible() && !this.shouldRenderGSICategory() && !this.selectedYaml()) {
            dynamicClass = 'mainSectionWithHistory';
        } else if (this.isChatHistory() && this.isSideMenuVisible() && !this.shouldRenderGSICategory()) {
            dynamicClass = 'mainSectionWithBChatAndWithChat';
        } else if (this.isChatHistory() && !this.isSideMenuVisible() && !this.shouldRenderGSICategory()) {
            dynamicClass = 'mainSectionWithoutLeft';
        } else if (this.shouldRenderGSICategory() && this.shouldRenderGSICategoryChat() && !this.isSideMenuVisible()) {
            dynamicClass = 'mainSectionWithBChat';
        }
        else if (this.shouldRenderGSICategory() && this.isSideMenuVisible() && !this.shouldRenderGSICategoryChat() && !this.selectedYaml()) {
            dynamicClass = 'mainSectionWithBChatAndMenu';
        } else if (this.isChatHistory() && this.selectedYaml() && this.shouldRenderGSICategory() && this.isSideMenuVisible() && !this.shouldRenderGSICategoryChat()) {
            dynamicClass = 'mainSectionWithHistorywithOutChatWithYaml';
        }
        else if (this.isChatHistory() && !this.selectedYaml() && this.shouldRenderGSICategory() && this.isSideMenuVisible() && this.shouldRenderGSICategoryChat()) {
            dynamicClass = 'mainSectionWithHistorywithoutYML';
        }
        else if (this.isChatHistory() && !this.shouldRenderGSICategoryChat() && this.selectedYaml()) {
            dynamicClass = "mainSectionWithOutBChat"
        }
        return dynamicClass;
    }

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void {

    };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };
};