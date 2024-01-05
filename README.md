# runtime-env

> **The twelve-factor app stores config in _environment variables_** (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code. - [The Twelve-Factor App](https://12factor.net/config)

## Feature

- **🔒 Security First** - No environment variables will be exposed to clients unless you define it in a schema file.

- **✅ Type Safe** - No more forgetting to provide environment variables. Using runtime-env, if your code compiles, it works.

- **🚀 Save Time** - Speed up your CI/CD pipeline, you no longer need to build multiple bundles for different stages.

## Introduction

This package generates a JavaScript module and a TypeScript declaration file from your environment variables:

```js
// runtime-env.js
globalThis.runtimeEnv = {
  FOO: "foo",
  BAR: {
    BAZ: 42,
  },
};
```

```ts
// runtime-env.d.js
declare const runtimeEnv: {
  readonly FOO: string;
  readonly BAR?: {
    readonly BAZ?: number;
  };
};
```

You can import the JavaScript module from anywhere:

```html
<!-- index.html -->
<script src="/path/to/runtime-env.js"></script>
```

```js
// jest.config.ts
export default {
  setupFiles: ["<rootDir>/path/to/runtime-env.js"],
};
```

```js
// web-worker.js
importScripts("path/to/runtime-env.js");
```

And use it like this:

```ts
// main.js

// input
console.log(runtimeEnv.FOO);
console.log(runtimeEnv.BAR.BAZ);

// output
console.log("foo");
console.log(42);
```

```html
<!-- index.html -->

<!-- input -->
<div><%= runtime.FOO %></div>
<div><%= runtime.BAR.BAZ %></div>

<!-- output -->
<div>foo</div>
<div>42</div>
```

## Getting Start

1. Install runtime-env from npm:

   ```sh
   $ npm i @runtime-env/cli
   ```

1. Configure runtime-env:

   `.runtimeenvrc.json`

   ```json
   {
     "globalVariableName": "runtimeEnv",
     "envSchemaFilePath": "runtime-env-schema.json",
     "genJs": [
       {
         "mode": "development",
         "envFilePath": ".env",
         "userEnvironment": true,
         "outputFilePath": "path/to/runtime-env.js"
       }
     ],
     "genTs": {
       "outputFilePath": "path/to/runtime-env.d.ts"
     }
   }
   ```

1. Define which environment variables to be loaded and how they should be parsed:

   `runtime-env-schema.json`:

   ```json
   {
     "type": "object",
     "properties": {
       "FOO": {
         "type": "string"
       },
       "BAR": {
         "type": "object",
         "properties": {
           "BAZ": {
             "type": "number"
           }
         }
       }
     },
     "required": ["FOO"]
   }
   ```

1. Generate `runtime-env.js` and `runtime-env.d.ts`, and interpolate `index.html`:

   `.env`

   ```ini
   FOO="default"
   BAR="{"BAZ":42}"
   SECRET="****" # this will be ignored because we didn't define it in the schema above
   ```

   ```sh
   $ export FOO="foo" # this will overrides default variable in the `.env` file
   ```

   ```sh
   $ runtime-env gen-js --mode development
   $ runtime-env gen-ts
   $ runtime-env interpolate "`cat path/to/index.html | sed 's/"/\\"/'`" > path/to/index.html
   ```

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

### Configuration File

We use [cosmiconfig](https://www.npmjs.com/package/cosmiconfig#searchplaces) to load config from your root directory:

runtime-env uses [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) for configuration file support. Here is some example places you can configure:

1. A `runtimeenv` key in your package.json file.
1. A `.runtimeenvrc` file written in JSON or YAML.
1. A `.runtimeenvrc.json` file.

Visit [here](https://www.npmjs.com/package/cosmiconfig#searchplaces) to see all available places to configure (replace `moduleName` with `runtimeenv`).

### Options

| Default    | Path                      | Type                                        | Description                                                                                                                                                                   |
| ---------- | ------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _required_ | `globalVariableName`      | `string`                                    |                                                                                                                                                                               |
| _required_ | `envSchemaFilePath`       | `string`                                    | File path related to `process.cwd()`                                                                                                                                          |
|            | `genJs`                   | `array`                                     |                                                                                                                                                                               |
| _required_ | `genJs.*`                 | `object`                                    |                                                                                                                                                                               |
| _required_ | `genJs.*.mode`            | `string`                                    | Instruct the CLI which configuration to use                                                                                                                                   |
| `null`     | `genJs.*.envFilePath`     | `null` \| `string` \| `[string, ...string]` | Leave `null` to mean no env files are loaded. File path related to `process.cwd()`                                                                                            |
| _required_ | `genJs.*.userEnvironment` | `boolean`                                   | Indicates whether environment variables should be loaded from `process.env`. `process.env.*` takes precedence over the environment variables loaded via `genJs.*.envFilePath` |
| _required_ | `genJs.*.outputFilePath`  | `string`                                    |                                                                                                                                                                               |
|            | `genTs`                   | object                                      |                                                                                                                                                                               |
| _required_ | `genTs.outputFilePath`    | string                                      | File path related to `process.cwd()`                                                                                                                                          |
