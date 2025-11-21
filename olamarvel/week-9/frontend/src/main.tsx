import React from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./AppLayout";
import Home from "./app/page";
import { BrowserRouter } from "react-router-dom";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Home />
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
