## Why

Agents often fall into a "String Trap" where they default to `string` types in `.runtimeenvschema.json` because they see environment variables defined as strings in legacy files like `vite-env.d.ts`. This leads to redundant manual parsing (e.g., `JSON.parse`, `parseInt`) remaining in the source code after migration, bypassing the automatic parsing and validation benefits of `runtime-env`.

## What Changes

- **Update Specification**: Add a new requirement to the `agent-skills` spec for "Avoiding the String Trap" during schema discovery.
- **Update Rule**: Modify the `add-new-environment-variables.md` rule to explicitly warn agents to prioritize source code usage over `vite-env.d.ts` type definitions.
- **Guidance**: Explicitly define that `vite-env.d.ts` is a historical artifact that should be considered misleading if it conflicts with actual parsing logic in the code.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `agent-skills`: Update requirements to include specific guidance on avoiding misleading legacy type definitions and prioritize deep usage discovery.

## Impact

- **Agent Behavior**: AI agents will create more accurate schemas with proper types (number, boolean, object) instead of defaulting to strings.
- **Code Quality**: Migrations will result in cleaner code by removing manual parsing logic.
- **Reliability**: Better validation of environment variables at startup via `runtime-env`'s schema enforcement.
