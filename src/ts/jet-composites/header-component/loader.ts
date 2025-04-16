import Composite = require("ojs/ojcomposite");
import * as view from "text!./header-component-view.html";
import viewModel from "./header-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./header-component-styles.css";

Composite.register("header-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "header-component": any;
    }
  }
}