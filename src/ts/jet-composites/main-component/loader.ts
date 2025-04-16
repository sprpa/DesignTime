import Composite = require("ojs/ojcomposite");
import * as view from "text!./main-component-view.html";
import viewModel from "./main-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./main-component-styles.css";
import "chat-component/loader";
import "chat-history-component/loader";
import "header-component/loader";
import "footer-component/loader";
import "left-sidemenu-component/loader";
import "right-sidemenu-component/loader";
import "drawio-component/loader";
import "ojs/ojnavigationlist";
import "ojs/ojbutton";
import "ojs/ojtoolbar";
import "gs-component/loader";
import "drawio-component/loader";
import "bchat-component/loader";
import "baccordion-component/loader";
import "codeview-component/loader";
import "finetune-component/loader";
import "home-component/loader";

Composite.register("main-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "main-component": any;
    }
  }
}