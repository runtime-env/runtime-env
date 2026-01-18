const app = document.querySelector<HTMLDivElement>("#app")!;
app.textContent = globalThis.runtimeEnv.VITE_FOO;
