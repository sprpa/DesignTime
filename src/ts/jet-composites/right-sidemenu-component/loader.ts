import Composite = require("ojs/ojcomposite");
import * as view from "text!./right-sidemenu-component-view.html";
import viewModel from "./right-sidemenu-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./right-sidemenu-component-styles.css";

Composite.register("right-sidemenu-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "right-sidemenu-component": any;
    }
  }
}