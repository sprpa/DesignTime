import Composite = require("ojs/ojcomposite");
import * as view from "text!./function-component-view.html";
import viewModel from "./function-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./function-component-styles.css";

Composite.register("function-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "function-component": any;
    }
  }
}