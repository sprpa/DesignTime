"use strict";

import * as ko from "knockout";
import * as ojkeyset from "ojs/ojkeyset";
import "ojs/ojknockout";
import componentStrings = require("ojL10n!./resources/nls/left-sidemenu-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import ArrayDataProvider = require("ojs/ojarraydataprovider");

interface UserInfo {
    company?: string;
    email?: string;
    full_name?: string;
    optimistic_user?: boolean;
    phone_number?: string;
    profilePic?: string;
    status?: string;
    user_id?: number;
    username?: string;
}

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    menuListId: ko.Observable<string>;
    menuItems: ko.ObservableArray<{ id: number; label: string; icon: string }>;
    menuDataProvider: ArrayDataProvider<number, { id: number; label: string; icon: string }>;
    selectedMenuItems = ko.observable(new ojkeyset.KeySetImpl());
    isChatHistory: ko.Observable<boolean>;

    user_info: ko.Observable<UserInfo>;
    profileImageSrc: ko.PureComputed<string>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {

        const userData: UserInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');

        this.user_info = ko.observable(userData);

        console.log(this.user_info());

        this.profileImageSrc = ko.pureComputed(() => {
            const pic = this.user_info().profilePic;
            if (pic && pic.trim() !== '') {
                // Prefix with proper Base64 MIME type
                return `data:image/png;base64,${pic}`;
            } else {
                return '../../../assets/images/profile.png';
            }
        });




        // Busy Context for handling async operations
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { description: "Left Side Menu Component Initialization" };
        this.busyResolve = busyContext.addBusyState(options);

        this.composite = context.element;
        this.properties = context.properties;
        this.res = componentStrings["left-sidemenu-component"];
        this.isChatHistory = ko.observable(false);

        // Observable to track selected menu item
        this.menuListId = ko.observable('menuList_' + new Date().getTime());
        this.selectedMenuItems = ko.observable(new ojkeyset.KeySetImpl());
        this.menuItems = ko.observableArray([
            { id: 1, label: "Chat", icon: "oj-ux-ico-message" },
        ]);

        this.selectedMenuItems.subscribe((newSelection) => {
            const selectedKeys = newSelection.values();
            if (selectedKeys.size > 0) {
                const selectedKey = Array.from(selectedKeys)[0]; // Get first selected item
                const selectedItem = this.menuItems().find(item => item.id === selectedKey);
                if (selectedItem) {
                    if (selectedItem.label === "Chat") {
                        this.isChatHistory(!this.isChatHistory());
                    } else {
                        this.isChatHistory(false);
                    }

                    let event = new CustomEvent("buttonToggle", {
                        detail: { flag: this.isChatHistory() },
                        bubbles: true
                    });
                    context.element.dispatchEvent(event);

                }
            }
        });

        document.addEventListener("buttonToggle", (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!customEvent.detail.flag) {
                this.isChatHistory(customEvent.detail.flag)
                this.selectedMenuItems(new ojkeyset.KeySetImpl());
            }
        });

        // Create an ArrayDataProvider for oj-list-view
        this.menuDataProvider = new ArrayDataProvider(this.menuItems, { keyAttributes: "id" });

        // Resolve Busy Context
        this.busyResolve();
    }

    navigateToChat() {

        // Dispatch custom event with selected node data
        const selectionEvent = new CustomEvent("selectedvalues", {
            detail: { title: "Chat" },
            bubbles: true
        });
        this.composite.dispatchEvent(selectionEvent);
    }


    /** Lifecycle Hook: Called before the component is created */
    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): void { }

    /** Lifecycle Hook: Called when the component is attached to the DOM */
    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void {


        setTimeout(() => {
            // const profileObs = this.properties.profile;
            const profileObs = Object.keys(this.properties.profile).length > 0
                ? this.properties.profile
                : this.user_info();

            console.log(profileObs);
            // Subscribe to updates
            this.user_info(profileObs); // This will automatically trigger recomputation

            // If profile already has value
            console.log(this.user_info(), "pic");

        }, 2000);


    }

    /** Lifecycle Hook: Called after Knockout bindings are applied */
    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { }

    /** Lifecycle Hook: Called when the component is removed from the DOM */
    disconnected(element: Element): void { }

}
