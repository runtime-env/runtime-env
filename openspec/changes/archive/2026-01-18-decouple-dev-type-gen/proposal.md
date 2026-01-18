# Change: Decouple Type Generation in Vite Plugin Dev Mode

## Why

In `vite-plugin`'s development mode, the type generation (`gen-ts`) is currently blocked if the JavaScript generation (`gen-js`) fails. This often happens when a required environment variable is missing from `.env` files. Since `gen-ts` only depends on the schema and not the actual environment values, it should be allowed to run even when `gen-js` fails. This ensures that developers always have up-to-date type definitions reflecting their schema, even while they are in the process of fixing environment configuration errors.

## What Changes

- Re-order the execution in development mode so that type generation (`gen-ts`) occurs before the potentially failing JavaScript generation (`gen-js`).
- Ensure that a failure in `gen-js` does not prevent `gen-ts` from having completed its task.
- Update the `vite-plugin` specification to explicitly require this resilient behavior in development mode.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/dev.ts`
