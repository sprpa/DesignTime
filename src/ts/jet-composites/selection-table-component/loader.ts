import Composite = require("ojs/ojcomposite");
import * as view from "text!./selection-table-component-view.html";
import viewModel from "./selection-table-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./selection-table-component-styles.css";

Composite.register("selection-table-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "selection-table-component": any;
    }
  }
}