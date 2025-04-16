import Composite = require("ojs/ojcomposite");
import * as view from "text!./chat-history-component-view.html";
import viewModel from "./chat-history-component-viewModel";
import * as metadata from "text!./component.json";
import "css!./chat-history-component-styles.css";

Composite.register("chat-history-component", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "chat-history-component": any;
    }
  }
}