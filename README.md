# runtime-env

> **The twelve-factor app stores config in _environment variables_** (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code. - [The Twelve-Factor App](https://12factor.net/config)

## Feature

- **🔒 Security First** - No environment variables will be exposed to clients unless you define it in a .env.example file.

- **✅ Type Safe** - No more forgetting to provide environment variables. Using runtime-env, if your code compiles, it works.

- **🚀 Save Time** - Speed up your CI/CD pipeline, you no longer need to build multiple bundles for different stages.

## Getting Started

1. Install CLI:

   ```sh
   $ npm i @runtime-env/cli -D
   ```

1. Configure runtime-env:

   Example configuration:

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
         "outputFilePath": "public/runtime-env.js"
       }
     ],
     "genTs": {
       "outputFilePath": "src/runtime-env.d.ts"
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
             "type": "string"
           }
         }
       }
     },
     "required": ["FOO"]
   }
   ```

1. Generate `runtime-env.js`:

   ```sh
   $ echo "FOO=\"development\"\nBAR=\"{\"BAZ\":\"value\"}\"\nSECRET=\"****\"" > .env
   $ export FOO="escape<"
   $ runtime-env gen-js --mode development
   ```

   Example output:

   `runtime-env.js`

   ```js
   // Generated by '@runtime-env/cli'

   globalThis.runtimeEnv = {
     FOO: "escape\\u003C",
     BAR: {
       BAZ: "value",
     },
   };
   ```

   In order to run `runtime-env` in a production environment, you may also need to package the `runtime-env` into a standalone executable, in which case you can use a tool such as [pkg](https://npmjs.com/pkg) to do this, for example:

   ```sh
   $ pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-alpine-x64 --output runtime-env-alpine
   ```

   Then run it like we did before:

   ```sh
   $ runtime-env-alpine gen-js --mode production
   ```

1. Generate `runtime-env.d.ts`:

   ```sh
   $ runtime-env gen-ts
   ```

   Example output:

   `runtime-env.d.ts`

   ```ts
   // Generated by '@runtime-env/cli'

   declare const runtimeEnv: {
     readonly FOO: string;
     readonly BAR?: {
       readonly BAZ?: string;
     };
   };
   ```

1. Use it:

   `src/index.js`

   ```ts
   console.log(runtimeEnv.FOO);
   console.log(runtimeEnv.BAR?.BAZ);
   ```

1. Load `runtime-env.js`:

   `index.html`

   ```html
   <script src="/runtime-env.js"></script>
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

| Default    | Path                      | Type               | Description                                                                                                                                                                   |
| ---------- | ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _required_ | `globalVariableName`      | `string`           |                                                                                                                                                                               |
| _required_ | `envSchemaFilePath`       | `string`           | File path related to `process.cwd()`                                                                                                                                          |
|            | `genJs`                   | `array`            |                                                                                                                                                                               |
| _required_ | `genJs.*`                 | `object`           |                                                                                                                                                                               |
| _required_ | `genJs.*.mode`            | `string`           | Instruct the CLI which configuration to use                                                                                                                                   |
| `null`     | `genJs.*.envFilePath`     | `null` \| `string` | Leave `null` to mean no env files are loaded. File path related to `process.cwd()`                                                                                            |
| _required_ | `genJs.*.userEnvironment` | `boolean`          | Indicates whether environment variables should be loaded from `process.env`. `process.env.*` takes precedence over the environment variables loaded via `genJs.*.envFilePath` |
| _required_ | `genJs.*.outputFilePath`  | `string`           |                                                                                                                                                                               |
|            | `genTs`                   | object             |                                                                                                                                                                               |
| _required_ | `genTs.outputFilePath`    | string             | File path related to `process.cwd()`                                                                                                                                          |

## Further Setup

- You MUST configure your web server to prevent caching of `runtime-env.js`.

- If you are building PWA, you MUST to configure your ServiceWorker to use proper approach for caching `runtime-env.js` file.
