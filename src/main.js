// /src/main.js
// React entrypoint for Vite

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

// Create a root
const root = ReactDOM.createRoot(document.getElementById("root"))

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
