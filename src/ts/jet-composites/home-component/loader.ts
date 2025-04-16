import Composite = require("ojs/ojcomposite");
import * as view from "text!./home-component-view.html";
import viewModel from "./home-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./home-component-styles.css";

Composite.register("home-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "home-component": any;
    }
  }
}