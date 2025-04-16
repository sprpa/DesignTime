import Composite = require("ojs/ojcomposite");
import * as view from "text!./chat-component-view.html";
import viewModel from "./chat-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./chat-component-styles.css";
import "list-component/loader";
import "accordion-component/loader";

Composite.register("chat-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "chat-component": any;
    }
  }
}