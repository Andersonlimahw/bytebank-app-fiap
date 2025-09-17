import { registerRootComponent } from "expo";
import App from "./App";

if (typeof global.require === "undefined") {
  global.require = require;
}

registerRootComponent(App);
