"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/bchat-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    messageText: ko.Observable<string>;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };
    accordionData: ko.Observable<any>;
    selectedBreadData: ko.Observable<any>;
    loader: ko.Observable<any>;
    messages: ko.ObservableArray<any>;
    chatMessage: ko.Observable<string>;
    scrollContainer: ko.Observable<string>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        this.busyResolve = busyContext.addBusyState({ description: "Web Component Startup - Waiting for data" });

        this.composite = context.element;
        this.properties = context.properties;
        this.res = componentStrings["bchat-component"];

        this.loader = ko.observable();
        this.messageText = ko.observable("Hello from bchat-component");
        this.chatMessage = ko.observable("");
        this.messages = ko.observableArray();
        this.accordionData = ko.observableArray(this.properties.data);
        this.selectedBreadData = ko.observable(this.properties.breadData);
        this.scrollContainer = ko.observable("scrollContainer");
        // Initial bot message
        const newMessage = {
            user: "bot",
            prompt: "",
            p1: "",
            p2: "",
            p3: "",
            buttons: [],
            title: "",
            selectionType: "",
            nextStep: 0,
            fileUploadAllowed: false,
            buttonType: "",
            accordionData: this.accordionData()
        };

        this.messages.push(newMessage);
        this.scrollToBottom();
        this.busyResolve(); // Finish startup
    }
    scrollToBottom(): void {
        const chatContainer = document.getElementById(this.scrollContainer());
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    handleInputKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            const messageText = this.chatMessage().trim();

            if (!messageText) return;

            const newMessage = {
                user: "user",
                prompt: messageText,
                p1: "",
                p2: "",
                p3: "",
                buttons: [],
                title: "",
                selectionType: "",
                nextStep: 0,
                fileUploadAllowed: false,
                buttonType: ""
            };
            this.messages.push(newMessage);

            this.chatMessage(""); // Clear input
            this.scrollToBottom();
            this.getIntialContent(messageText)
        }
    };

    saveData = (): void => {
        const payload = {
            path: this.selectedBreadData(),
            prompt: "",
            selectedAccordion: this.accordionData()
        };

        console.log(payload);
    };


    getIntialContent = async (data:any) => {

        // let finalResponse =

        this.loader(true);
        const payload = {
            "user_prompt":data,
            "original_response":this.accordionData()
        }

        try {
            const response = await fetch("http://10.26.1.52:5098/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "",
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            let finalResponse;
            try {
                finalResponse = await response.json();

            } catch (jsonError) {
                throw new Error("Invalid JSON response from server.");
            }

            // Add bot's response to chat
            this.messages.push(finalResponse);

        } catch (error) {
            console.error("Error sending query:", error);
        } finally {
            this.loader(false);
            this.scrollToBottom();
        }
    };
    getLabel = (id: string | number): string | number => {
        const numId = Number(id);
        if (!isNaN(numId) && numId > 0) {
            return String.fromCharCode(64 + numId); // 1 → A, 2 → B, etc.
        }
        return id;
    };

    // Lifecycle methods
    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { }
    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { }
    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { }
    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { }
    disconnected(element: Element): void { }
}
