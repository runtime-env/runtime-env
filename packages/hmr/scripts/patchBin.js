const { readFileSync, writeFileSync } = require("fs");

const filePath = "bin/runtime-env.js";

const oldContent = readFileSync(filePath, "utf-8");
const newContent = `#!/usr/bin/env node\n'use strict';\n${oldContent}`;
writeFileSync(filePath, newContent);
