import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

const RemoteMessage = lazy(() => import("remote/RemoteMessage"));

function App() {
  return (
    <>
      <div>HOST: {globalThis.runtimeEnv.VITE_MESSAGE}</div>
      <Suspense fallback={null}>
        <RemoteMessage />
      </Suspense>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
