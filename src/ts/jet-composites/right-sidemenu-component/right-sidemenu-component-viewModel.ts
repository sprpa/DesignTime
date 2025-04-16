"use strict";

import * as ko from "knockout";
import 'oj-c/date-picker';
import 'ojs/ojdatetimepicker';
import * as ojkeyset from "ojs/ojkeyset";
import "ojs/ojknockout";
import componentStrings = require("ojL10n!./resources/nls/right-sidemenu-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import ArrayDataProvider = require("ojs/ojarraydataprovider");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    menuListId: ko.Observable<string>;
    menuItems: ko.ObservableArray<{ id: number; label: string; icon: string }>;
    menuDataProvider: ArrayDataProvider<number, { id: number; label: string; icon: string }>;
    selectedMenuItems = ko.observable(new ojkeyset.KeySetImpl());
    isPopupVisible: ko.Observable<boolean>;

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);
        this.composite = context.element;

        //Example observable
        this.properties = context.properties;
        this.res = componentStrings["right-sidemenu-component"];

        this.isPopupVisible = ko.observable(false);
        this.menuListId = ko.observable('menuList_' + new Date().getTime());
        this.selectedMenuItems = ko.observable(new ojkeyset.KeySetImpl());
        this.menuItems = ko.observableArray([
            { id: 1, label: "Notification", icon: "oj-ux-ico-home" },
            { id: 2, label: "Recommend", icon: "oj-ux-ico-contact" },
            { id: 3, label: "Calender", icon: "oj-ux-ico-contact" },
            { id: 4, label: "Notes", icon: "oj-ux-ico-contact" },
            { id: 5, label: "Transactions", icon: "oj-ux-ico-contact" },
        ]);

        // Subscribe to selection changes
        this.selectedMenuItems.subscribe((newSelection) => {
            const selectedKeys = newSelection.values();
            if (selectedKeys.size > 0) {
                const selectedKey = Array.from(selectedKeys)[0];
                const selectedItem = this.menuItems().find(item => item.id === selectedKey);
                if (selectedItem) {
                    console.log("Selected Menu Item:", selectedItem.label);
                }
            }
        });

        // Create an ArrayDataProvider for oj-list-view
        this.menuDataProvider = new ArrayDataProvider(this.menuItems, { keyAttributes: "id" });

        // Resolve Busy Context
        this.busyResolve();
    }

    togglePopup = () => {
        this.isPopupVisible(!this.isPopupVisible());
    };

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

    disconnected(element: Element): void { };

};