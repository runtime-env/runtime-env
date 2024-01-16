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

In this document, we assume that you have set the following environment variables:

user environment

```sh
$ export TAG_ID="G-ABCD12345"
```

.env file

```ini
FIREBASE_CONFIG={"apiKey":"AIzaSk2CngkeAyDJr2BhzSprQXp8PsZs3VFJFMA","authDomain":"example.firebaseapp.com"}
```

This package offers a complete runtime environment variable solution for Web applications.

1. HTML

   Input:

   ```html
   <!-- index.html -->
   <script
     async
     src="https://www.googletagmanager.com/gtag/js?id=<%= runtimeEnv.TAG_ID %>"
   ></script>
   ```

   Execute `runtime-env interpolate` command to replace templates with environment variables:

   ```sh
   $ npx runtime-env interpolate --input-file-path index.html --output-file-path index.html
   ```

   Output:

   ```html
   <!-- index.html -->
   <script
     async
     src="https://www.googletagmanager.com/gtag/js?id=G-ABCD12345"
   ></script>
   ```

   We use <a href='https://lodash.com/docs/4.17.15#template' target='_blank'>lodash.template</a> to interpolate.

1. JavaScript

   Source:

   ```html
   <!-- index.html -->
   <script src="/runtime-env.js"></script>
   <script src="/main.js"></script>
   ```

   ```js
   // main.js
   import { initializeApp } from "firebase/app";
   const app = initializeApp(runtimeENv.FIREBASE_CONFIG);
   ```

   Execute `runtime-env gen-js` command to generate environment variables global object:

   ```sh
   $ npx runtime-env gen-js --mode production
   ```

   Output:

   ```js
   // runtime-env.js
   globalThis.runtimeEnv = {
     TAG_ID: "G-ABCD12345",
     FIREBASE_CONFIG: {
       apiKey: "AIzaSk2CngkeAyDJr2BhzSprQXp8PsZs3VFJFMA",
       authDomain: "example.firebaseapp.com",
     },
   };
   ```

1. TypeScript

   Execute `runtime-env gen-ts` command to generate environment variables types:

   ```sh
   $ npx runtime-env gen-ts
   ```

   Output:

   ```ts
   // runtime-env.d.ts
   declare const runtimeEnv: {
     readonly TAG_ID: string;
     readonly FIREBASE_CONFIG: {
       readonly apiKey: string;
       readonly authDomain: string;
     };
   };
   ```

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
       "TAG_ID": {
         "type": "string"
       },
       "FIREBASE_CONFIG": {
         "type": "object",
         "properties": {
           "apiKey": {
             "type": "string"
           },
           "authDomain": {
             "type": "string"
           }
         },
         "required": ["apiKey", "authDomain"]
       }
     },
     "required": ["TAG_ID", "FIREBASE_CONFIG"]
   }
   ```

   We use <a href='https://ajv.js.org/' target='_blank'>Ajv</a> to parse <a href='https://json-schema.org/' target='_blank'>JSON-schema</a>.

1. Further setups:

   - You **MUST** configure your web server to prevent caching of `runtime-env.js`.

   - In order to execute `runtime-env` in environment without NodeJS runtime, you can:

     1. Install NodeJS and NPM package manager:

        ```
        # Dockerfile
        FROM nginx:stable-alpine3.17

        apk add --update nodejs npm
        ```

     2. Or, package the `runtime-env` to a executable:

        ```sh
        $ pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-alpine-x64 --output runtime-env
        ```

   - If you are building a PWA, you **MUST** to configure your ServiceWorker to use proper approach for caching `runtime-env.js` file.

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
