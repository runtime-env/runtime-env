# runtime-env

> **The twelve-factor app stores config in _environment variables_** (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code. - [The Twelve-Factor App](https://12factor.net/config)

## Table of Content

- [Installation](#installation)
- [Get Started](#get-started)
- [Setup](#setup)
- [Commands](#commands)
- [Syntax](#syntax)

## Installation

```sh
$ npm i -D @runtime-env/cli
```

## Get Started

1. Source code

   `index.html`:

   ```html
   <!doctype html>
   <html>
     <head>
       <title><%= runtimeEnv.TITLE %></title>
     </head>
     <body>
       <script src="/runtime-env.js"></script>
       <script src="/index.js"></script>
     </body>
   </html>
   ```

   `index.js`:

   ```js
   console.log(runtimeEnv.TITLE);
   ```

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

2. Run commands

   `user environment`:

   ```sh
   $ export TITLE="Hello Runtime Env!"
   ```

   Run `npx -p @runtime-env/cli runtime-env interpolate --input-file index.html --output-file index.html` to interpolate the template in the html file:

   ```html
   <!doctype html>
   <html>
     <head>
       <title>Hello Runtime Env!</title>
     </head>
     <body>
       <script src="/runtime-env.js"></script>
       <script src="/index.js"></script>
     </body>
   </html>
   ```

   Run `npx -p @runtime-env/cli runtime-env gen-js --output-file runtime-env.js` to generate a JavaScript file which contains environment variables:

   `runtime-env.js`:

   ```js
   globalThis.runtimeEnv = {
     TITLE: "Hello Runtime Env!",
   };
   ```

   Run `npx -p @runtime-env/cli runtime-env gen-ts --output-file runtime-env.d.ts` to generate a TypeScript file which contains corresponding types of environment variables:

   `runtime-env.d.ts`:

   ```ts
   // type DeepReadonly<T> = ...

   declare global {
     var runtimeEnv: RuntimeEnv;
   }

   export type RuntimeEnv = DeepReadonly<{
     TITLE: string;
   }>;
   ```

3. The final result

   `index.html` (modified):

   ```diff
   <!doctype html>
   <html>
     <head>
   -   <title><%= runtimeEnv.TITLE %></title>
   +   <title>Hello Runtime Env!</title>
     </head>
     <body>
       <script src="/runtime-env.js"></script>
       <script src="/index.js"></script>
     </body>
   </html>
   ```

   `index.js`:

   ```js
   console.log(runtimeEnv.TITLE);
   ```

   `runtime-env.js` (generated):

   ```diff
   + globalThis.runtimeEnv = {
   +   TITLE: "Hello Runtime Env!",
   + };
   ```

   `runtime-env.d.ts` (generated):

   ```diff
   + // type DeepReadonly<T> = ...
   +
   + declare global {
   +   var runtimeEnv: RuntimeEnv;
   + }
   +
   + export type RuntimeEnv = DeepReadonly<{
   +   TITLE: string;
   + }>;
   ```

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

   - To use runtime-env on systems that don't have Node.js installed, you'll need to pack `runtime-env` CLI into a single runnable file. Here's how you can do it:

     - Make a single runnable app using NodeJS's [Single Executable Applications](https://nodejs.org/api/single-executable-applications.html) feature (experimental).

     - Pack runtime-env into a runnable file using [pkg](https://github.com/vercel/pkg):

       ```sh
       $ pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-alpine-x64 --output runtime-env
       ```

   - If you're making a PWA (Progressive Web App), you **HAVE TO** set up your ServiceWorker to choose the right way to cache runtime-env.js.

## Commands

- `$ npx -p @runtime-env/cli runtime-env --help`

  ```
  Usage: runtime-env [options] [command]

  Options:
    -V, --version                                output the version number
    --global-variable-name <globalVariableName>  specify the global variable name (default: "runtimeEnv")
    --schema-file <schemaFile>                   specify the json schema file to be loaded (default: ".runtimeenvschema.json")
    -h, --help                                   display help for command

  Commands:
    gen-js [options]                             generate a JavaScript file that includes environment variables within an object,
                                                 making them accessible through the globalThis property
    gen-ts [options]                             generate a TypeScript file that provides the corresponding type definitions for the
                                                 JavaScript file generated by the gen-js command
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

- For HTML, you can use environment variables by a <a href='https://lodash.com/docs/4.17.15#template' target='_blank'>template</a>:

  ```html
  <!-- Syntax: <%= <globalVariableName>.<environmentVariableName> %> -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=<%= runtimeEnv.TAG_ID %>"
  ></script>
  ```

- For JavaScript, you can read environment variables through the `globalThis` property:

  ```js
  // Syntax: <globalVariableName>.<environmentVariableName>
  initializeApp(runtimeEnv.FIREBASE_CONFIG);
  ```
