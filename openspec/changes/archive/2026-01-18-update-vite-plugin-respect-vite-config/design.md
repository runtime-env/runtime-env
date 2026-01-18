## Context

Vite's `envPrefix` is a critical security feature. If a user sets `envPrefix: 'APP_'`, Vite will only load variables starting with `APP_` into `import.meta.env`. `@runtime-env/vite-plugin` bypasses this by using its own schema-based generation. To align with Vite's security model, we should enforce that the schema only contains variables that the user has explicitly allowed via `envPrefix`.

## Decisions

- **Validation Timing**: Validation will occur whenever `gen-js`, `gen-ts`, or `interpolate` is about to be called, or more simply, as a prerequisite for any runtime-env operation within the plugin.
- **Reading the Schema**: The plugin will read and parse `.runtimeenvschema.json` directly to extract keys for validation. This avoids extra CLI calls just for key extraction.
- **Handling envPrefix**: We will support both string and string array values for `envPrefix`, matching Vite's type definition.
- **Failure Behavior**:
  - **Dev**: Log error to terminal and send to HMR overlay. Do not stop the server, but prevent `runtime-env.js` from being updated with invalid content.
  - **Build/Test**: Fail the process with a non-zero exit code.
  - **Preview**: Log error and continue (matching current error handling strategy for preview).

## Implementation Details

The validation utility will:

1. Load the schema from `schemaFile`.
2. Extract the `properties` keys.
3. Check if each key starts with any of the prefixes in `envPrefix`.
4. If a key doesn't match, return a detailed error listing the offending keys and the allowed prefixes.
