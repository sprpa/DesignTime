import Composite = require("ojs/ojcomposite");
import * as view from "text!./baccordion-component-view.html";
import viewModel from "./baccordion-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./baccordion-component-styles.css";

Composite.register("baccordion-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "baccordion-component": any;
    }
  }
}