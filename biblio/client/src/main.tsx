import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./store/index.ts";
import { Provider } from "react-redux";

import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Theme preset={presetGpnDefault}>
        <div className="mainContainer">
          <RouterProvider router={router} />
          <ToastContainer />
        </div>
      </Theme>
    </Provider>
  </StrictMode>
);
