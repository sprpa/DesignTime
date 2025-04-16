import Composite = require("ojs/ojcomposite");
import * as view from "text!./accordion-component-view.html";
import viewModel from "./accordion-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./accordion-component-styles.css";

Composite.register("accordion-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "accordion-component": any;
    }
  }
}