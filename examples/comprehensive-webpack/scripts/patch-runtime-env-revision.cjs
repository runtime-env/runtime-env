const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const base = process.argv[2];

// Patch runtime-env.js revision
const runtimeEnv = path.resolve(base, "runtime-env.js");
const runtimeEnvContent = fs.readFileSync(runtimeEnv, "utf8");
// https://github.com/GoogleChrome/workbox/blob/04ba6442c466d2e8197fe586672143d201af3a61/packages/workbox-webpack-plugin/src/lib/get-asset-hash.js
const runtimeEnvHash = crypto
  .createHash("md5")
  .update(runtimeEnvContent)
  .digest("hex");

// Patch index.html revision (interpolated at runtime)
const indexHtml = path.resolve(base, "index.html");
const indexHtmlContent = fs.readFileSync(indexHtml, "utf8");
const indexHtmlHash = crypto
  .createHash("md5")
  .update(indexHtmlContent)
  .digest("hex");

// Update service worker with actual hashes
const serviceWorker = path.resolve(base, "service-worker.js");
let serviceWorkerContent = fs.readFileSync(serviceWorker, "utf8");

// Replace placeholders with actual hashes
serviceWorkerContent = serviceWorkerContent.replace(
  /({url:"runtime-env\.js",revision:)"[^"]+"/,
  `$1"${runtimeEnvHash}"`,
);
serviceWorkerContent = serviceWorkerContent.replace(
  /({url:"index\.html",revision:)"[^"]+"/,
  `$1"${indexHtmlHash}"`,
);

fs.writeFileSync(serviceWorker, serviceWorkerContent, "utf8");
