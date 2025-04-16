import Composite = require("ojs/ojcomposite");
import * as view from "text!./left-sidemenu-component-view.html";
import viewModel from "./left-sidemenu-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./left-sidemenu-component-styles.css";

Composite.register("left-sidemenu-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "left-sidemenu-component": any;
    }
  }
}