import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

// Below is the Original Code remove comment if you want to use the original form
/* const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string); */

//Active code is for local use only just comment it if you will be disabling it and use the original above
const convex = new ConvexReactClient("https://reliable-seahorse-215.convex.cloud");

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);
