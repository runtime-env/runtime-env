# 02 - Discovery

The "Think" phase. Before changing any code, you must fully understand how environment variables are currently used in the project.

## Prerequisites

- Completion of `01-setup.md`.
- A clear map of existing environment variables (check `.env` files).

## Steps

### 1. Identify All Environment Variables

List all variables used in the project.

- **Action**: Check `.env`, `.env.development`, `.env.production`, and `.env.local`.
- **Action**: Search for `import.meta.env.VITE_` in the codebase.
- **Action**: Search for `%VITE_...%` in `index.html`.

### 2. Analyze Usage Patterns

For each variable identified, determine its **actual** type by looking at how it is used.

- **Action**: Look for manual parsing (the "String Trap").
  - Is it passed to `parseInt()` or `Number()`? (Target Type: `number`)
  - Is it compared to `"true"` or `"false"`? (Target Type: `boolean`)
  - Is it passed to `JSON.parse()`? (Target Type: **Object** or **Array**)
- **Action**: Perform **Deep Schema Discovery** for complex types:
  - **Enums**: If used in a `switch` statement or compared against a fixed set of string literals (e.g., `if (val === 'production')`), define it as a `string` with an `enum` array in the schema.
  - **Arrays**: If used with `.split(',')` or similar, define it as an `array` with the appropriate `items` type.
  - **Objects**: If identified as an object, you **MUST** identify its properties. NEVER use a generic `{"type": "object"}` without defined `properties`.
- **Action**: Refer to `the-string-trap.md` for more examples.

### 3. Map to Schema

Draft the entry for each variable for the `.runtimeenvschema.json` file.

- **Action**: Decide on the `type` and any `default` values.
- **Action**: Identify which variables are strictly required for the app to function.

## Verification

Before proceeding to `03-migration.md`, verify:

- [ ] You have a complete list of all `VITE_` prefixed environment variables.
- [ ] You have identified which variables require non-string types due to manual parsing.
- [ ] You have a draft schema ready to be applied.
