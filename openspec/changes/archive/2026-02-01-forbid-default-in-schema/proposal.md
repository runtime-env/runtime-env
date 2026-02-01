## Why

Standard JSON Schema allows the `default` keyword, but in the `@runtime-env` architecture, it creates a "source of truth" conflict. We want to ensure that all environment values originate from the environment itself (or `.env` files), keeping the schema as a pure validation contract and type definition source.

While the `default` keyword was previously accepted by the schema parser (AJV), it was **silently ignored** by the CLI during environment variable interpolation and generation. Allowing defaults in the schema makes the system's behavior implicit and harder to debug, as the schema might suggest a fallback that never actually triggers.

## What Changes

- **Modified**: The `@runtime-env/cli` will now explicitly forbid the `default` keyword in `.runtimeenvschema.json` using the `strict: true` and `prohibited` keyword features of AJV.
- **Validation**: Added a check in the CLI's schema loading logic to identify and report the use of `default` with a clear error message.
- **Documentation**: Updated the `runtime-env-vite-plugin` skill and its references to explicitly **forbid** the use of `default` values in the schema and provide a rationale for this prohibition.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cli`: Added strict validation against the `default` keyword in JSON schemas to enforce the single source of truth.
- `agent-skills`: Updated the `runtime-env-vite-plugin` skill to include the new prohibition and rationale.

## Impact

- **Developers**: Will receive a clear error message from the CLI if they attempt to use `default` in their schema, guiding them to provide values via the environment instead.
- **AI Agents**: The updated skill will guide agents through a two-tiered approach:
  - **During Migration**: Agents SHALL NOT generate `default` keywords in the schema. They MAY keep existing manual fallbacks in the source code (e.g., `runtimeEnv.VAR || 'fallback'`) to ensure stability during the transition, but MUST explicitly recommend that users remove these fallbacks once the environment configuration is verified.
  - **For New Variables**: When adding environment variables to an already migrated project, agents MUST NOT use manual fallbacks in the code. Instead, they MUST define the variable as `required` in `.runtimeenvschema.json` and ensure it is provided via the environment.
  - **Prohibition**: In all cases, the `default` keyword is strictly prohibited in the JSON schema.
- **Compatibility**: This is a **BREAKING** change for any existing projects that were using `default` in their schema. While it does not change the runtime behavior (since defaults were ignored), it will now cause a hard validation failure during CLI operations, requiring users to remove the prohibited keyword.
