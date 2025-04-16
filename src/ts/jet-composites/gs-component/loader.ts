import Composite = require("ojs/ojcomposite");
import * as view from "text!./gs-component-view.html";
import viewModel from "./gs-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./gs-component-styles.css";
import "codeview-component/loader"

Composite.register("gs-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "gs-component": any;
    }
  }
}