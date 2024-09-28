const { readFileSync, writeFileSync } = require("fs");

const file = "bin/runtime-env.js";

const oldContent = readFileSync(file, "utf-8");
const newContent = `#!/usr/bin/env node\n'use strict';\n${oldContent}`;
writeFileSync(file, newContent);
