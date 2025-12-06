const app = document.querySelector<HTMLDivElement>("#app")!;
app.textContent = globalThis.runtimeEnv.FOO;

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
