import Composite = require("ojs/ojcomposite");
import * as view from "text!./list-component-view.html";
import viewModel from "./list-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./list-component-styles.css";
import "ojs/ojlistview"

Composite.register("list-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "list-component": any;
    }
  }
}