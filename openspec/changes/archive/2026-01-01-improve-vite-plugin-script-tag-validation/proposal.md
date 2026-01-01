# Change: Improve Vite Plugin Script Tag Validation

## Why

The current detection of the `runtime-env.js` script tag in `index.html` is brittle, using simple string inclusion that doesn't account for different `base` URL configurations, attribute order, or quote types. Furthermore, missing this tag during production builds results in a silent failure (only a warning in logs), which leads to broken applications where environment variables are unavailable at runtime.

## What Changes

- **Robust Detection**: Implement a regex-based detection for the `runtime-env.js` script tag that accounts for `base` URL, varying whitespace, attribute order, and quote styles.
- **Fail on Build**: Change the behavior in Vite `build` mode to explicitly fail the build process if the required script tag is missing.
- **Improved Warnings**: Update `dev` mode to use the robust detection logic for its warning message.
- **Redundancy Removal**: Ensure that preview mode relies on the build-time check and does not perform redundant (and potentially incorrect) validations.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/build.ts`, `packages/vite-plugin/src/dev.ts`, `packages/vite-plugin/src/utils.ts`
- **BREAKING**: Production builds will now fail if the mandatory `<script src="/runtime-env.js"></script>` (or base-prefixed version) is missing.
