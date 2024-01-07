# runtime-env

> **The twelve-factor app stores config in _environment variables_** (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code. - [The Twelve-Factor App](https://12factor.net/config)

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)
- [Configuration](#configuration)
- [Environment Variable Load Order](#environment-variable-load-order)

## Installation

`npm i -D @runtime-env/cli`

## Usage

This package offers a complete runtime environment variable solution for Web applications:

1. JavaScript

   ```sh
   $ export TITLE="Awesome Website"
   $ npx runtime-env gen-js --mode production
   $ cat runtime-env.js
   # globalThis.runtimeEnv = {
   #   TITLE: "Awesome Website",
   # };
   ```

1. TypeScript

   ```sh
   $ npx runtime-env gen-ts
   $ cat runtime-env.d.ts
   # declare const runtimeEnv: {
   #   readonly TITLE: string;
   # };
   ```

1. HTML

   ```sh
   $ cat index.html
   # <title><%= runtimeEnv.TITLE %></title>
   $ export TITLE="Awesome Website"
   $ npx runtime-env interpolate --input-file-path index.html --output-file-path index.html
   # or npx runtime-env interpolate "`cat index.html`" > index.html
   $ cat index.html
   # <title>Awesome Website</title>
   ```

   We use <a href='https://lodash.com/docs/4.17.15#template' target='_blank'>lodash.template</a> to interpolate.

## Setup

1. Create a [configuration](#configuration) file:

   `.runtimeenvrc.json`

   ```json
   {
     "globalVariableName": "runtimeEnv",
     "envSchemaFilePath": ".runtimeenvschema.json",
     "genJs": [
       {
         "mode": "production",
         "envFilePath": null,
         "userEnvironment": true,
         "outputFilePath": "dist/runtime-env.js"
       }
     ],
     "genTs": {
       "outputFilePath": "src/runtime-env.d.ts"
     }
   }
   ```

1. Create a JSON schema file:

   `.runtimeenvschema.json`:

   ```json
   {
     "type": "object",
     "properties": {
       "TITLE": {
         "type": "string"
       }
     },
     "required": ["TITLE"]
   }
   ```

   We use <a href='https://ajv.js.org/' target='_blank'>Ajv</a> to parse <a href='https://json-schema.org/' target='_blank'>JSON-schema</a>.

1. Further setups:

   - You **MUST** configure your web server to prevent caching of `runtime-env.js`.

   - If you are building a PWA, you **MUST** to configure your ServiceWorker to use proper approach for caching `runtime-env.js` file.

   - In order to run `runtime-env` in a production environment, you may also need to package the `runtime-env` into a standalone executable, in which case you can use a tool such as [pkg](https://npmjs.com/pkg) to do this, for example:

     ```sh
     $ pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-alpine-x64 --output runtime-env-alpine
     ```

     Then run it:

     ```sh
     $ runtime-env-alpine gen-js --mode production
     ```

## Configuration

### File

Runtime-env uses [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) for configuration file support. Visit [here](https://www.npmjs.com/package/cosmiconfig#searchplaces) to see all available places to configure (replace `moduleName` with `runtimeenv`).

### Options

| Default    | Path                      | Type                                        | Description                                                                        |
| ---------- | ------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| _required_ | `globalVariableName`      | `string`                                    |                                                                                    |
| _required_ | `envSchemaFilePath`       | `string`                                    | File path related to `process.cwd()`                                               |
|            | `genJs`                   | `array`                                     |                                                                                    |
| _required_ | `genJs.*`                 | `object`                                    |                                                                                    |
| _required_ | `genJs.*.mode`            | `string`                                    | Instruct the CLI which configuration to use                                        |
| `null`     | `genJs.*.envFilePath`     | `null` \| `string` \| `[string, ...string]` | Leave `null` to mean no env files are loaded. File path related to `process.cwd()` |
| _required_ | `genJs.*.userEnvironment` | `boolean`                                   | Indicates whether environment variables should be loaded from `process.env`.       |
| _required_ | `genJs.*.outputFilePath`  | `string`                                    |                                                                                    |
|            | `genTs`                   | object                                      |                                                                                    |
| _required_ | `genTs.outputFilePath`    | string                                      | File path related to `process.cwd()`                                               |

## Environment Variable Load Order

Environment variables are looked up in the following places, in order, stopping once the variables is found.

1. `process.env`
1. `genJs.*.envFilePath[N-1]`
1. `genJs.*.envFilePath[N-2]`
1. `genJs.*.envFilePath[...]`
1. `genJs.*.envFilePath[0]`

Best practice:

`.runtimeenvrc.json`

```json
{
  "genJs": [
    // for better DX
    {
      "mode": "development",
      "envFilePath": [".env.development", ".env.local"],
      "userEnvironment": true,
      "outputFilePath": "src/runtime-env.js"
    },
    // produce the same results for everyone
    {
      "mode": "test",
      "envFilePath": ".env.test",
      "userEnvironment": false,
      "outputFilePath": "test/runtime-env.js"
    },
    // only load env from user environment, for example `docker run --env`
    {
      "mode": "production",
      "envFilePath": null,
      "userEnvironment": true,
      "outputFilePath": "dist/runtime-env.js"
    }
  ],
  ...
}
```

`.gitignore`

```
.env.local
!.env.development
!.env.test
```
