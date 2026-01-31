## Context

The current `runtime-env-vite-plugin` skill encourages a "minimal change" approach during migration, which often leaves manual parsing logic (like `JSON.parse`) in the source code even after a typed schema is defined. This creates redundancy and bypasses the automatic parsing capabilities of the `@runtime-env/cli`.

## Goals / Non-Goals

**Goals:**

- Update the `add-new-environment-variables` rule to prioritize deep schema discovery.
- Update the "Correct" and "Incorrect" examples to show removal of manual parsing logic.
- Ensure agents understand that `runtimeEnv` global already contains parsed values for non-string types.

**Non-Goals:**

- Changing the underlying behavior of `@runtime-env/cli` or `@runtime-env/vite-plugin`.
- Modifying other skills unrelated to `runtime-env`.

## Decisions

### Decision 1: Favor Code Cleanliness over Minimal Diffs

- **Rationale**: Minimal diffs are less important than correct usage of the library's features. Leaving `JSON.parse` in the code after the library has already parsed the value is confusing and brittle.
- **Alternatives**: Keeping the `JSON.stringify(JSON.parse(...))` wrapper was considered to minimize changes, but it was found to be a "code smell" that hides the true benefit of using a typed schema.

### Decision 2: Deep Schema Discovery

- **Rationale**: Agents should actively search for how a variable is used (e.g., looking for `parseInt`, `Number()`, `JSON.parse`, or `=== 'true'`) to infer the best type for the schema.
- **Alternatives**: Relying only on the variable name or a default "string" type.

## Risks / Trade-offs

- **Risk**: Agents might incorrectly infer a type if the usage is ambiguous.
- **Mitigation**: The guidelines will emphasize "carefully searching how an environment variable is being used".
- **Risk**: Larger diffs during migration.
- **Mitigation**: This is acceptable for the benefit of cleaner, more maintainable code.
