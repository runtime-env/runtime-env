# runtime-env

## Getting Started

1. Install CLI:

   ```sh
   $ npm i @runtime-env/cli -D
   ```

1. Define which environment variables to be loaded:

   `.env.example`:

   ```ini
   FOO=
   ```

1. Configure runtime-env:

   `.runtimeenvrc.json`:

   ```json
   {
     "globalVariableName": "runtimeEnv",
     "genJs": [
       {
         "mode": "development",
         "envExampleFilePath": ".env.example",
         "envFilePath": ".env",
         "userEnvironment": false,
         "outputFilePath": "public/runtime-env.js"
       },
       {
         "mode": "test",
         "envExampleFilePath": ".env.example",
         "envFilePath": ".env",
         "userEnvironment": false,
         "outputFilePath": "jest/setup-files/runtime-env.js"
       },
       {
         "mode": "production",
         "envExampleFilePath": ".env.example",
         "envFilePath": null,
         "userEnvironment": true,
         "outputFilePath": "dist/runtime-env.js"
       }
     ],
     "genTs": {
       "envExampleFilePath": ".env.example",
       "outputFilePath": "src/runtime-env.d.ts"
     }
   }
   ```

1. Generate `runtime-env.js`:

   ```sh
   $ echo "FOO=development" > .env
   $ runtime-env gen-js --mode development
   ```

   ```sh
   $ echo "FOO=test" > .env
   $ runtime-env gen-js --mode test
   ```

   ```sh
   $ export FOO=production
   $ runtime-env gen-js --mode production
   ```

1. Generate `runtime-env.d.ts`:

   ```sh
   $ runtime-env gen-ts
   ```

1. Use it:

   ```ts
   console.log(runtimeEnv.FOO);
   ```
