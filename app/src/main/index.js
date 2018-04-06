"use strict";

import { app, BrowserWindow } from "electron";
import path from "path";
import menubar from "menubar";
import { extend } from "lodash";

let menu_options = {
  alwaysOnTop: false,
  preloadWindow: true,
  icon: path.join(__dirname, "../renderer/assets/logo.png"),
  y: 25,
  width: 450,
  height: 600,
  transparent: true,
  tooltip: "Bible Helper"
};

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

extend(menu_options, {
  index:
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`
});

const Menu = menubar(menu_options);

// Events
app.on("ready", () => {
  Menu.showWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
