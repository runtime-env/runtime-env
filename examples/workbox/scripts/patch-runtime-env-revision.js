const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const base = process.argv[2];
const runtimeEnvPath = path.resolve(base, "runtime-env.js");
const runtimeEnvContent = fs.readFileSync(runtimeEnvPath, "utf8");
// https://github.com/GoogleChrome/workbox/blob/04ba6442c466d2e8197fe586672143d201af3a61/packages/workbox-webpack-plugin/src/lib/get-asset-hash.js
const hash = crypto.createHash("md5").update(runtimeEnvContent).digest("hex");
const serviceWorkerPath = path.resolve(base, "service-worker.js");
const serviceWorkerContent = fs.readFileSync(serviceWorkerPath, "utf8");
fs.writeFileSync(
  serviceWorkerPath,
  serviceWorkerContent.replace("placeholder", hash),
  "utf8",
);
