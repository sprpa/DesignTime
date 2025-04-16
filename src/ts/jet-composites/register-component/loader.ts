import Composite = require("ojs/ojcomposite");
import * as view from "text!./register-component-view.html";
import viewModel from "./register-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./register-component-styles.css";

Composite.register("register-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "register-component": any;
    }
  }
}