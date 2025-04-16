import Composite = require("ojs/ojcomposite");
import * as view from "text!./bchat-component-view.html";
import viewModel from "./bchat-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./bchat-component-styles.css";
import "baccordion-component/loader"

Composite.register("bchat-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "bchat-component": any;
    }
  }
}