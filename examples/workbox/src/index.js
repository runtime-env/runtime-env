navigator.serviceWorker
  .register("./service-worker.js")
  .then((registration) => registration.update());

document.body.appendChild(document.createTextNode(`${runtimeEnv.FOO}`));
