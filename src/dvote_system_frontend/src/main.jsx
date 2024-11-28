import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./output.css";
import "react-toastify/dist/ReactToastify.css";
import { AgentProvider } from "@ic-reactor/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AgentProvider withLocalEnv={process.env.DFX_NETWORK === "local"}>
      <App />
    </AgentProvider>
  </React.StrictMode>,
);
