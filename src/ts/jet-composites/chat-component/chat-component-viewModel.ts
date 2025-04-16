"use strict";

import * as ko from "knockout";
import 'oj-c/checkbox';
import "oj-c/input-text";
import "ojs/ojdatetimepicker";
import "ojs/ojfilepicker";
import "ojs/ojinputtext";
import "ojs/ojknockout";
import 'ojs/ojpagingcontrol';
import 'ojs/ojselectcombobox';
import 'ojs/ojselectsingle';
import "ojs/ojtable";
import componentStrings = require("ojL10n!./resources/nls/chat-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import ArrayDataProvider = require("ojs/ojarraydataprovider");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    title1 = ko.observable<string>("");
    title2 = ko.observable<string>("");
    btnText = ko.observable<string>("");
    userMessage = ko.observable<string>("");
    isVoiceIconClicked = ko.observable<boolean>(false);
    isInputFocused = ko.observable<boolean>(false);
    chatInput: ko.Observable<string>;
    input: ko.Observable<string>;
    loader: ko.Observable<boolean>;
    // messages: ko.ObservableArray<{ user: string, h5: string, p1: string, p2: string, p3: string, buttons: any, title: string, selectionType: string, nextStep: number, fileUploadAllowed: boolean, buttonType: string }>;
    messages: ko.ObservableArray<any>;
    messagesDataProvider: ArrayDataProvider<string, {
        user: string;
        text: string;
        dateTime: string;
        displayFormat: string;
        data: any;
    }>;

    scrollContainer: ko.Observable<string>;
    isMenuVisible = ko.observable(false);
    activeSubmenu = ko.observable<string | null>(null);

    // Payload Variables
    payload: ko.ObservableArray<{
        currentStep: number;
        selectedValues: {
            action: string;
            industry: string;
            domains: string[];
            region_and_localization: string[];
            userpersonas_and_roles: string[];
            user_journey_and_workflow: any[];
            access_management_and_security: any[];
            key_offerings_and_features: any[];
            reporting_and_analytics: any[];
            channels_and_interfaces: any[];
            integrations_and_interoperability: any[];
            compliance_and_requiremets: any[];
            security_and_measures: any[];
            save_solution: any[];
        };
        file: File | null;
        UserPrompt: string;
    }>;

    nextSteps: ko.Observable<number> = ko.observable(1);
    keyAttribute: ko.Observable<string>;
    pushArrayName: ko.Observable<string>;
    selectedEvent: ko.Observable<string>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;

        this.chatInput = ko.observable("chatInput");
        this.input = ko.observable("input");
        this.loader = ko.observable(false);
        this.title1 = ko.observable("World's First Solution Generative Model");
        this.title2 = ko.observable("Patented Across Us, Europe, Africa, Asia, Australia \n Solutions Is Natural Language - Without Writing Or Question A Single Line Of Code \n Ask Me About Nsl Invention & Constructs.");
        this.btnText = ko.observable("Next");
        this.userMessage = ko.observable("");
        this.properties = context.properties;
        this.res = componentStrings["chat-component"];
        this.keyAttribute = ko.observable("")
        this.pushArrayName = ko.observable("")
        this.selectedEvent = ko.observable("")

        this.messages = ko.observableArray<{
            user: string;
            h5: string;
            p1: string,
            p2: string,
            p3: string,
            buttons: any,
            title: string,
            selectionType: string,
            nextStep: number,
            fileUploadAllowed: boolean,
            buttonType: string
        }>([]);





        this.scrollContainer = ko.observable("scrollContainer");

        // Oracle JET requires keyAttributes, using dateTime as a unique identifier
        this.messagesDataProvider = new ArrayDataProvider(this.messages, { keyAttributes: "dateTime" });

        // Payload variables Initialization
        this.payload = ko.observableArray<any>([{
            currentStep: 0,
            selectedValues: {
                action: "",
                industry: "",
                domains: [],
                region_and_localization: [],
                userpersonas_and_roles: [],
                user_journey_and_workflow: [],
                access_management_and_security: [],
                key_offerings_and_features: [],
                reporting_and_analytics: [],
                channels_and_interfaces: [],
                integrations_and_interoperability: [],
                compliance_and_requiremets: [],
                security_and_measures: [],
                save_solution: []
            },
            file: null,
            UserPrompt: ""
        }]);


        this.onClickVoiceIcon = this.onClickVoiceIcon.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getBotResponse = this.getBotResponse.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.setupEventListeners(context.element);


        //Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }


    navigateToFineTuning = () => {

    };




    getDefaultContent(param: string) {

        if (param == "FineTune") {

            // Dispatch custom event with selected node data
            const selectionEvent = new CustomEvent("selectedvalues", {
                detail: { title: param },
                bubbles: true
            });
            this.composite.dispatchEvent(selectionEvent);
            // window.open("http://10.26.1.52:5150/", "_blank"); // open in new tab

        } else {
            console.log(param);

            let event = new CustomEvent("chatOpen", {
                detail: { flag: true },
                bubbles: true
            });
            this.composite.dispatchEvent(event);
            this.selectedEvent(param)

            // if (param) {
            //     const payloadData = this.payload()[0];
            //     if (payloadData) {
            //         payloadData.currentStep = this.nextSteps();
            //         payloadData.selectedValues.action = param
            //         this.payload.valueHasMutated();
            //     }

            // }
            if (param == "Edit a solution") {
                this.getIntialContent();
            }


        }


    }

    getIntialContent = async () => {

        // let finalResponse =


        this.loader(true);

        try {
            const response = await fetch("http://10.26.1.52:8010/api/solutions", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            let finalResponse;
            try {
                finalResponse = await response.json();

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
            this.scrollToBottom();
        }
    };

    CreateSolution = async (message : any) => {

        // let finalResponse =


        this.loader(true);
        const payload={
            "message": message
          }
          

        try {
            const response = await fetch("http://10.26.1.52:8010/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            let finalResponse;
            try {
                finalResponse = await response.json();

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
            this.scrollToBottom();
        }
    };

    handleChipClick = (event: any): void => {
        const clickedButton = event.target as HTMLElement;
        const messageContainer = clickedButton.closest(".message-container");

        if (!messageContainer) return;

        const messageElement = messageContainer.closest(".message");
        if (!messageElement) return;

        const selectionType = messageElement.getAttribute("data-selection-type") || "single";
        const isMultipleSelection = selectionType === "multiple";
        const messageTitle = messageElement.getAttribute("data-title") || "";

        const validKeys = ["action", "industry", "domains", "channels_and_interfaces", "security_and_measures", "compliance_and_requiremets", "userpersonas_and_roles", "user_journey_and_workflow", "region_and_localization", "key_offerings_and_features", "reporting_and_analytics", "integrations_and_interoperability", "channels_and_interfaces", "save_solution"] as const;
        if (!validKeys.includes(messageTitle as any)) {
            console.warn(`Invalid message title: ${messageTitle}`);
            return;
        }

        const payloadData = this.payload()[0];
        payloadData.currentStep = this.nextSteps();

        const key = messageTitle as keyof typeof payloadData.selectedValues;
        const selectedValue = clickedButton.innerText.trim();
        const buttonsInGroup = messageContainer.querySelectorAll(".custom-tag");

        if (isMultipleSelection) {
            if (!Array.isArray(payloadData.selectedValues[key])) {
                console.error(`Expected an array for '${key}', but found a string.`);
                return;
            }

            let currentValues = [...(payloadData.selectedValues[key] as string[])];

            if (currentValues.includes(selectedValue)) {
                payloadData.selectedValues[key] = currentValues.filter(val => val !== selectedValue) as any;
            } else {
                payloadData.selectedValues[key] = [...currentValues, selectedValue] as any;
            }

            clickedButton.classList.toggle("active");
        } else {
            buttonsInGroup.forEach((btn) => {
                if (btn instanceof HTMLElement) {
                    btn.classList.toggle("active", btn === clickedButton);
                }
            });

            if (key === "action" || key === "industry") {
                payloadData.selectedValues[key] = selectedValue as any;
            } else {
                payloadData.selectedValues[key] = [selectedValue] as any;
            }
        }

        this.payload.valueHasMutated();
        console.log("Updated Payload:", ko.toJS(this.payload));

    };

    handleKeyDown(event: KeyboardEvent): boolean {
        if (event.key === "Enter") {
            const inputElement = event.target as HTMLInputElement; // Get input field
            const newMessage = inputElement.value.trim(); // Read latest value

            // if (newMessage !== "") {
            this.userMessage(newMessage); // Manually update observable
            this.userMessage.valueHasMutated(); // Ensure UI refresh
            this.sendMessage(); // Send message

            setTimeout(() => {
                this.userMessage(""); // Clear input field
                this.userMessage.valueHasMutated(); // Ensure UI refresh
            }, 0);
            // }

            return false;
        }
        return true;
    }

    sendIconClicked = () => {
        const chatInputElement = document.getElementById("chatInput") as HTMLInputElement;
        const newMessage = chatInputElement?.value.trim() || "";

        console.log(newMessage)
        // if (newMessage !== "") {
        this.userMessage(newMessage); // Manually update observable
        this.userMessage.valueHasMutated(); // Ensure UI refresh
        this.sendMessage(); // Send message

        setTimeout(() => {
            this.userMessage(""); // Clear input field
            this.userMessage.valueHasMutated(); // Ensure UI refresh
        }, 0);
        // }
    }

    sendMessage(): void {
        console.log("HI")
        // if (!this.userMessage().trim()) return;

        const messageText = this.userMessage();
        const newMessage = {
            user: "user",
            h5: messageText,
        };

        this.CreateSolution(messageText);
        this.messages.push(newMessage);

        // Recreate DataProvider to force UI update
        this.messagesDataProvider = new ArrayDataProvider(this.messages(), { keyAttributes: "dateTime" });

        this.userMessage("");
        this.userMessage.valueHasMutated();
        document.getElementById("chatInput")?.blur();
        document.getElementById("chatInput")?.focus();

        this.getBotResponse(messageText);
        console.log(this.messages())
    }

    
    getBotResponse = async (query: string) => {
        const payloadData = this.payload()[0];
        payloadData.UserPrompt = query;
        payloadData.currentStep = this.nextSteps()
        //this.getIntialContent()
    };

    setupEventListeners(element: Element) {
        element.addEventListener("selectedRoleName", (event: Event) => {
            const customEvent = event as CustomEvent;
            const payloadData = this.payload()[0];
            console.log(customEvent.detail);

            // payloadData.selectedValues[this.pushArrayName()] = customEvent.detail;

            type SelectedValuesKeys = keyof typeof payloadData.selectedValues;
            const key = this.pushArrayName() as SelectedValuesKeys;
            payloadData.selectedValues[key] = customEvent.detail;

        });
    }

    scrollToBottom(): void {
        const chatContainer = document.getElementById(this.scrollContainer());
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    getCurrentDateTime(): string {
        const now = new Date();

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        // Return the formatted date and time as a string in the desired format
        return now.toLocaleString('en-GB', options).replace(',', '').replace('AM', 'AM').replace('PM', 'PM');
    }

    toggleMenu = () => {
        this.isMenuVisible(!this.isMenuVisible());
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            if (this.isMenuVisible()) {
                sidebar.classList.add("menu-visible");
            } else {
                sidebar.classList.remove("menu-visible");
            }
        }
        document.body.classList.toggle("menu-open", this.isMenuVisible()); // Adds/removes the class
    };

    closeMenu = () => {
        this.isMenuVisible(false);
        this.activeSubmenu(null);
        // Remove class when closing menu
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.remove("menu-visible");
        }
        document.body.classList.remove("menu-open");
    };

    toggleSubmenu = (menu: string | null) => {
        if (this.activeSubmenu() === menu) {
            this.activeSubmenu(null);
        } else {
            this.activeSubmenu(menu);
        }
    };

    onClickVoiceIcon(): void {
        this.isVoiceIconClicked(true);
    }

    onInputFocus(): void {
        this.isVoiceIconClicked(false);
        this.isInputFocused(true);
    }

    onInputBlur(): void {
        this.isInputFocused(false);
    }

    // Lifecycle methods - implement if necessary 

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };

};