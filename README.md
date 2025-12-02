# runtime-env

> **The twelve-factor app stores config in _environment variables_** (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code. - [The Twelve-Factor App](https://12factor.net/config)

[![CI](https://github.com/runtime-env/runtime-env/actions/workflows/ci.yml/badge.svg)](https://github.com/runtime-env/runtime-env/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@runtime-env/cli?color=blue)](https://www.npmjs.com/package/@runtime-env/cli)

## Table of Content

- [Installation](#installation)
- [Get Started](#get-started)
- [Setup](#setup)
- [Commands](#commands)
- [Syntax](#syntax)

## Installation

```sh
npm install --save-dev @runtime-env/cli
```

## Get Started

1. Create a JSON-schema file and define your environment variables:

   `.runtimeenvschema.json`

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

2. Using environment variables in your code:

   `index.js`

   ```js
   document.body.textContent = globalThis.runtimeEnv.TITLE;
   ```

3. Set environment variables in your terminal:

   ```sh
   export TITLE="Hello Runtime Env"
   ```

4. Use the `runtime-env` CLI to generate a JavaScript file:

   ```sh
   npx --package @runtime-env/cli runtime-env gen-js --output-file runtime-env.js
   ```

5. Import the generated file before importing the entry point:

   `index.html`

   ```html
   <!doctype html>
   <html>
     <body>
       <script src="./runtime-env.js"></script>
       <script src="./index.js"></script>
     </body>
   </html>
   ```

6. Open `index.html` in your browser, and you will see `Hello Runtime Env` in the console.

7. Set a new environment variable, regenerate the JavaScript file, and refresh the page:

   ```sh
   export TITLE="Yo Runtime Env"
   npx --package @runtime-env/cli runtime-env gen-js --output-file runtime-env.js
   ```

8. That's it! You don't need to rebuild your app to update the environment variables anymore.

## Setup

1. Create a <a href='https://json-schema.org/' target='_blank'>JSON-schema</a> file:

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

   You could use other file name by running `npx -p @runtime-env/cli runtime-env --schema-file ...`.

   Runtime-env uses <a href='https://ajv.js.org/' target='_blank'>Ajv</a> to parse your JSON-schema.

1. Configure your package.json, Dockerfile, etc. to generate, and interpolate files:
   - To generate a JavaScript file which contains the environment variables, you will execute `runtime-env gen-js`:

     ```sh
     $ npx -p @runtime-env/cli runtime-env gen-js --output-file runtime-env.js
     ```

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

     And make sure to import the generated file before importing the entry point:

     ```html
     <!-- index.html -->
     <script src="/runtime-env.js"></script>
     <script src="/index.js"></script>
     ```

   - If you are using TypeScript, you can also generate a _declaration file_ by running `runtime-env gen-ts`:

     ```sh
     $ npx -p @runtime-env/cli runtime-env gen-ts --output-file runtime-env.d.ts
     ```

     ```ts
     // runtime-env.d.ts
     // type DeepReadonly<T> = ...

     declare global {
       var runtimeEnv: RuntimeEnv;
     }

     export type RuntimeEnv = DeepReadonly<{
       TAG_ID: string;
       FIREBASE_CONFIG: {
         apiKey: string;
         authDomain: string;
       };
     }>;
     ```

   - For `index.html` and other non-JavaScript files, if needed, you can run `runtime-env interpolate`:

     ```sh
     $ npx -p @runtime-env/cli runtime-env interpolate --input-file index.html --output-file index.html
     ```

     ```html
     <script
       async
       src="https://www.googletagmanager.com/gtag/js?id=G-ABCD12345"
     ></script>
     ```

1. Further setups:
   - You **NEED** to set up your web server to stop runtime-env.js to be cached by browser or CDNs.

   - To use runtime-env on systems that don't have Node.js installed, you'll need to pack `runtime-env` CLI into a single runnable file. You can make a single runnable app using NodeJS's [Single Executable Applications](https://nodejs.org/api/single-executable-applications.html) feature.

   - If you're making a PWA (Progressive Web App), you **HAVE TO** set up your ServiceWorker to choose the right way to cache runtime-env.js.

## Commands

- `$ npx -p @runtime-env/cli runtime-env --help`

  ```
  Usage: runtime-env [options] [command]

  Options:
    -V, --version                                output the version number
    --global-variable-name <globalVariableName>  specify the global variable name (default: "runtimeEnv")
    --schema-file <schemaFile>                   specify the json schema file to be loaded (default: ".runtimeenvschema.json")
    --watch                                      turn on watch mode (default: false)
    -h, --help                                   display help for command

  Commands:
    gen-js [options]                             generate a JavaScript file that includes environment variables within an object, making them
                                                accessible through the globalThis property
    gen-ts [options]                             generate a TypeScript file that provides the corresponding type definitions for the JavaScript
                                                file generated by the gen-js command
    interpolate [options]                        perform template interpolation by substituting environment variables
    help [command]                               display help for command
  ```

- `$ npx -p @runtime-env/cli runtime-env gen-js --help`

  ```
  Usage: runtime-env gen-js [options]

  generate a JavaScript file that includes environment variables within an object, making them accessible through the globalThis property

  Options:
    --env-file <envFile...>     set environment variables from supplied file (requires Node.js v20.12.0) (default: [])
    --output-file <outputFile>  specify the output file to be written instead of being piped to stdout
    -h, --help                  display help for command
  ```

- `$ npx -p @runtime-env/cli runtime-env gen-ts --help`

  ```
  Usage: runtime-env gen-ts [options]

  generate a TypeScript file that provides the corresponding type definitions for the JavaScript file generated by the gen-js command

  Options:
    --output-file <outputFile>  specify the output file to be written instead of being piped to stdout
    -h, --help                  display help for command
  ```

- `$ npx -p @runtime-env/cli runtime-env interpolate --help`

  ```
  Usage: runtime-env interpolate [options]

  perform template interpolation by substituting environment variables

  Options:
    --env-file <envFile...>     set environment variables from supplied file (requires Node.js v20.12.0) (default: [])
    --input-file <inputFile>    specify the input file to be loaded instead of being read from stdin
    --output-file <outputFile>  specify the output file to be written instead of being piped to stdout
    -h, --help                  display help for command
  ```

## Syntax

- For JavaScript, you can read environment variables through the `globalThis` property:

  ```js
  // Syntax: <globalVariableName>.<environmentVariableName>
  initializeApp(runtimeEnv.FIREBASE_CONFIG);
  ```

- For interpolation, you can use environment variables by a <a href='https://lodash.com/docs/4.17.15#template' target='_blank'>template</a>:

  ```html
  <!-- Syntax: <%= <globalVariableName>.<environmentVariableName> %> -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=<%= runtimeEnv.TAG_ID %>"
  ></script>
  ```
