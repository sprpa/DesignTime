import Composite = require("ojs/ojcomposite");
import * as view from "text!./codeview-component-view.html";
import viewModel from "./codeview-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./codeview-component-styles.css";

Composite.register("codeview-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "codeview-component": any;
    }
  }
}