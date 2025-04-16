import Composite = require("ojs/ojcomposite");
import * as view from "text!./footer-component-view.html";
import viewModel from "./footer-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./footer-component-styles.css";

Composite.register("footer-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "footer-component": any;
    }
  }
}