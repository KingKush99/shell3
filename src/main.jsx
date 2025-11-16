// src/main.js
// React entrypoint without JSX so Vite parses it as plain JS

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App, null)
    )
  );
} else {
  console.error("Root element '#root' not found in the document.");
}
