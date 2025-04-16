import Composite = require("ojs/ojcomposite");
import * as view from "text!./finetune-component-view.html";
import viewModel from "./finetune-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./finetune-component-styles.css";

Composite.register("finetune-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "finetune-component": any;
    }
  }
}