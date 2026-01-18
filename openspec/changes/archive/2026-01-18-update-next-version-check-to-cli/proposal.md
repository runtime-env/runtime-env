# Change: Update Next.js Version Check to Use CLI

## Why

The current method of checking the Next.js version relies on `require("next/package.json")`. This can fail in certain package manager configurations (like pnpm with strict hoisting) where the `next` package might not be directly accessible via `require`. Using the `next` CLI to check the version is more robust as it relies on the same mechanism users use to run Next.js.

## What Changes

- Update `getNextVersion` in `packages/next-plugin/src/utils.ts` to use `next -v` instead of reading `package.json`.
- Parse the output of `next -v` to extract the version number (e.g., from `Next.js v16.1.3` to `16.1.3`).

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/utils.ts`
