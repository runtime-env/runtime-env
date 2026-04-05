import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RemoteMessage from "./RemoteMessage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RemoteMessage />
  </StrictMode>,
);
