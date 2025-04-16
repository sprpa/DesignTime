"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/drawio-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";


export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
  busyResolve: (() => void);
  composite: Element;
  messageText: ko.Observable<string>;
  properties: Composite.PropertiesType;
  res: { [key: string]: string };
  xmlData: ko.Observable<string>

  constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
    const elementContext: Context = Context.getContext(context.element);
    const busyContext: Context.BusyContext = elementContext.getBusyContext();
    const options = { "description": "Web Component Startup - Waiting for data" };
    this.busyResolve = busyContext.addBusyState(options);

    this.composite = context.element;
    this.messageText = ko.observable("Hello from drawio-component");
    this.properties = context.properties;
    this.res = componentStrings["drawio-component"];
    this.getResponse(this.properties.data)
    this.xmlData = ko.observable("")

    this.busyResolve();
  }

  connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void {
    setTimeout(() => this.sendUMLClassDiagram(), 2000);
  }

  sendUMLClassDiagram() {
    const iframe = document.getElementById("drawio-editor") as HTMLIFrameElement;
    if (!iframe) {
      console.error("Error: Draw.io iframe not found!");
      return;
    }

    // Send the XML data to the Draw.io iframe
    iframe.contentWindow?.postMessage(JSON.stringify({
      action: "load",
      xml: this.xmlData()
    }), "*");
  }


  async getResponse(value: any) {
    const payload = {
      "id": "DIA001",
      "type": value
    };
    try {
      const response = await fetch(`http://10.26.1.52:5005/get-diagram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      let finalResponse;
      try {
        finalResponse = await response.json();
        this.xmlData(finalResponse[0].data)

      } catch (jsonError) {

        throw new Error("Invalid JSON response from server.");
      }
      return finalResponse; // ✅ Return the response for further processing

    } catch (error) {
      console.error("Error sending query:", error);


      return null;
    }
  }


  bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void { }
  propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void { }
  disconnected(element: Element): void { }
}
