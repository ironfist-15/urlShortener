import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Redirect from "./Redirects.jsx";

function Router() {
  const path = window.location.pathname;

  if (path !== "/") {
    return <Redirect />;
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Router />);
