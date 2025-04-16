"use strict";

import * as ko from "knockout";
import { AllKeySetImpl, KeySetImpl } from "ojs/ojkeyset";
import "ojs/ojknockout";
import { ojTable } from "ojs/ojtable";
import componentStrings = require("ojL10n!./resources/nls/selection-table-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import BufferingDataProvider = require("ojs/ojbufferingdataprovider");
import ArrayDataProvider = require("ojs/ojarraydataprovider");

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
  busyResolve: (() => void);
  composite: Element;
  properties: Composite.PropertiesType;
  res: { [key: string]: string };

  deptObservableArray: ko.ObservableArray<any>;
  dataProvider: ko.Observable<BufferingDataProvider<any, any>>;
  columns: ko.ObservableArray<any>;
  tableClass: ko.Observable<string>;
  tableKeyAttribute = ko.observable<string>("");


  constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
    //At the start of your viewModel constructor
    const elementContext: Context = Context.getContext(context.element);
    const busyContext: Context.BusyContext = elementContext.getBusyContext();
    const options = { "description": "Web Component Startup - Waiting for data" };
    this.busyResolve = busyContext.addBusyState(options);
    this.composite = context.element;

    // Example observable
    this.properties = context.properties;
    this.res = componentStrings["selection-table-component"];
    this.properties = context.properties;

    let emptyRowtableData = this.properties.data || [];
    let tableKeyAttributes = this.properties.attributesData || "";
    this.tableKeyAttribute = tableKeyAttributes;
    let className = this.properties.dataClass || "";
    this.tableClass = ko.observable("oj-sm-width-full oj-md-width-auto customTable " + className);

    // Convert complex row data into a flattened array
    this.deptObservableArray = ko.observableArray(
      emptyRowtableData.map((row: any) => {
        let flattenedRow: Record<string, any> = {};
        Object.keys(row).forEach((key) => {
          flattenedRow[key] = row[key]?.value ?? row[key]; // Handle undefined values
        });
        return flattenedRow;
      })
    );
    // Set up BufferingDataProvider with ArrayDataProvider
    this.dataProvider = ko.observable(
      new BufferingDataProvider(
        new ArrayDataProvider(this.deptObservableArray, { keyAttributes: tableKeyAttributes })
      )
    );

    // Generate columns dynamically based on the first row
    this.columns = ko.observableArray(
      this.deptObservableArray().length > 0
        ? Object.keys(this.deptObservableArray()[0]).map((key, index) =>
        (
          {
            field: key,
            headerText: key.replace(/([a-z])([A-Z])/g, "$1 $2"), // Format header text
            id: key,
            template: Array.isArray(this.deptObservableArray()[0][key]), // Assign template for specific fields
            minWidth: index === 0 ? "7rem" : "12rem",
            frozenEdge: index === 0 ? "all" : "",
            resizable: "enabled",
            className: "new-line oj-helper-overflow-wrap-anywhere oj-helper-white-space-normal oj-helper-text-align-start",
          }))
        : []
    );


    // Subscribe to changes in deptObservableArray and update dataProvider

  
    // Once all startup and async activities have finished, relocate if there are any async activities
    this.busyResolve();
  }

  selectedChangedListener = async (

    event: ojTable.selectedChanged<any, any>
  ) => {
    let selectedKeys: any;

    if (event.detail.value.row?.isAddAll()) {


      // Fetch all row keys from the data provider
      const allRowKeys: number[] = await this.getAllKeysFromDataProvider(this.tableKeyAttribute);

      console.log(allRowKeys);


      // Get unselected (excluded) row keys
      const excludedRows: number[] = Array.from(
        (event.detail.value.row as AllKeySetImpl<number>).deletedValues()
      );

      // Select all except the excluded ones
      selectedKeys = allRowKeys.filter((key) => !excludedRows.includes(key));

    } else {
      // Ensure selectedKeys is correctly extracted
      selectedKeys = event.detail.value.row instanceof Set
        ? event.detail.value.row
        : new Set((event.detail.value.row as KeySetImpl<any>)?.values?.() ?? []);

    }





    //console.log('Selected Keys:', Array.from(selectedKeys));

    const selectionEvent = new CustomEvent("selectedRoleName", {
      detail: Array.from(selectedKeys),
      bubbles: true
    });
    this.composite.dispatchEvent(selectionEvent);
  };


  /* This method is used to get all the keys from the DataProvider */
  getAllKeysFromDataProvider = async (key: any): Promise<number[]> => {
    let allKeys: any[] = [];
    const asyncIterable = this.dataProvider().fetchFirst({});

    for await (const fetchList of asyncIterable) {
      fetchList.data.forEach((row: any) => {
        allKeys.push(row[key]);
      });
    }

    return allKeys;
  };


  //Lifecycle methods - implement if necessary 

  activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void { };

  connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

  bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { };

  propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { };

  disconnected(element: Element): void { };
};