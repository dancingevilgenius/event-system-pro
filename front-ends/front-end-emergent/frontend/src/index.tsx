import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { AppThemeProvider } from "@/context/AppThemeProvider";
import { MessageProvider } from "@/context/MessageProvider";
import "@/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <MessageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MessageProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
