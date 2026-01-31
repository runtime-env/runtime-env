## Context

The `runtime-env` project uses JSON Schema to define the structure and validation rules for environment variables. Currently, the JSON Schema specification allows the `default` keyword, but our CLI implementation ignores it during environment variable interpolation. This leads to a "source of truth" conflict and developer confusion, as the schema might suggest a fallback that isn't applied.

To enforce a single source of truth (the environment itself), we need to explicitly forbid the `default` keyword in the schema.

## Goals / Non-Goals

**Goals:**
- Update the `@runtime-env/cli` to fail validation if `default` is present in the `.runtimeenvschema.json`.
- Provide clear error messages when `default` is detected.
- Update relevant agent skills to ensure AI agents follow this new constraint.

**Non-Goals:**
- Implement a mechanism to actually use `default` values from the schema (we want to forbid them).
- Automatically migrate existing schemas by removing `default` (users should do this manually to acknowledge the change).

## Decisions

### 1. Enforce prohibition via AJV configuration
We will leverage AJV's strict mode or custom validation rules to detect the `default` keyword.
- **Rationale**: AJV is already used for schema validation. Using its built-in capabilities (like `strictKeywords: true` or a custom keyword that throws) is the most idiomatic way to handle this.
- **Alternatives**: Manually traversing the JSON schema object to look for `default` keys. This is more brittle and duplicates AJV's parsing logic.

### 2. Update `runtime-env-vite-plugin` skill
The skill `skills/runtime-env-vite-plugin/SKILL.md` needs to be updated to explicitly state the prohibition.
- **Rationale**: Agents rely on this skill to understand how to interact with `runtime-env`.

## Risks / Trade-offs

- **[Risk] Breaking Change** → Existing projects with `default` in their schema will fail to build/validate.
  - **Mitigation**: Provide a clear error message explaining *why* it's forbidden and how to fix it (remove the keyword and use environment variables for defaults).
- **[Risk] Agent Confusion** → Agents might still try to add `default` if the skill update is not clear.
  - **Mitigation**: Use strong language (MUST NOT, PROHIBITED) in the skill documentation.
