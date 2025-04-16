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

    userMessage = ko.observable<string>("");
    isVoiceIconClicked = ko.observable<boolean>(false);
    isInputFocused = ko.observable<boolean>(false);
    chatInput: ko.Observable<string>;
    input: ko.Observable<string>;
    loader: ko.Observable<boolean>;
    messages: ko.ObservableArray<{ user: string, text: string, dateTime: string, displayFormat: string, data: any, missingParameters: any }>;
    messagesDataProvider: ArrayDataProvider<string, {
        user: string;
        text: string;
        dateTime: string;
        displayFormat: string;
        data: any;
    }>;

    scrollContainer: ko.Observable<string>;
    sessionId: ko.Observable<number>;
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
    yamlJsonData: any;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;

        this.sessionId = ko.observable(0);
        this.chatInput = ko.observable("chatInput");
        this.input = ko.observable("input");
        this.loader = ko.observable(false);
        this.userMessage = ko.observable("");
        this.properties = context.properties;
        this.res = componentStrings["chat-component"];
        this.messages = ko.observableArray<{
            user: string;
            text: string;
            dateTime: string;
            displayFormat: string;
            data: any;
            missingParameters: any,
            // fetchedData: any
        }>([]);

        this.scrollContainer = ko.observable("scrollContainer");

        // Oracle JET requires keyAttributes, using dateTime as a unique identifier
        this.messagesDataProvider = new ArrayDataProvider(this.messages, { keyAttributes: "dateTime" });

        this.onClickVoiceIcon = this.onClickVoiceIcon.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getBotResponse = this.getBotResponse.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        //Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }

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

    handleKeyDown(event: KeyboardEvent): boolean {
        if (event.key === "Enter") {
            const inputElement = event.target as HTMLInputElement; // Get input field
            const newMessage = inputElement.value.trim(); // Read latest value

            if (newMessage !== "") {
                this.userMessage(newMessage); // Manually update observable
                this.userMessage.valueHasMutated(); // Ensure UI refresh
                this.sendMessage(); // Send message

                setTimeout(() => {
                    this.userMessage(""); // Clear input field
                    this.userMessage.valueHasMutated(); // Ensure UI refresh
                }, 0);
            }

            return false;
        }
        return true;
    }

    sendMessage(): void {
        if (!this.userMessage().trim()) return;

        const messageText = this.userMessage();
        const newMessage = {
            user: "user",
            text: messageText,
            dateTime: this.getCurrentDateTime(),
            displayFormat: "",
            data: [],
            missingParameters: [],
            fetchedData: []
        };

        this.messages.push(newMessage);

        // Recreate DataProvider to force UI update
        this.messagesDataProvider = new ArrayDataProvider(this.messages(), { keyAttributes: "dateTime" });

        this.userMessage("");
        this.userMessage.valueHasMutated();
        document.getElementById("chatInput")?.blur();
        document.getElementById("chatInput")?.focus();

        this.getBotResponse(messageText);
        setTimeout(() => this.scrollToBottom(), 100);
    }

    getBotResponse = async (query: string) => {

        this.messages.push({
            user: "bot",
            text: "An error occurred. Please try again later.",
            dateTime: this.getCurrentDateTime(),
            displayFormat: "",
            data: [],
            missingParameters: [],
           

        });
        return;

    };

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

    // Lifecycle methods - implement if necessary 

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };

};