import Composite = require("ojs/ojcomposite");
import * as view from "text!./drawio-component-view.html";
import viewModel from "./drawio-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./drawio-component-styles.css";

Composite.register("drawio-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "drawio-component": any;
    }
  }
}