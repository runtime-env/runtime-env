## Context

Agents migrating to `runtime-env` often fall into the "String Trap." This occurs when they check `vite-env.d.ts` or `env.d.ts` for environment variable types and find they are all defined as `string`. Because these files are "formal" type definitions, agents treat them as a source of truth, ignoring the fact that the application code immediately parses these strings into objects, numbers, or booleans.

This results in a suboptimal migration where:

1. `.runtimeenvschema.json` uses `type: "string"` for everything.
2. The source code retains redundant `JSON.parse()` or `parseInt()` calls.
3. Type safety is weakened because the schema isn't validating the internal structure of complex variables.

## Goals / Non-Goals

**Goals:**

- Codify the "String Trap" as a specific anti-pattern in agent instructions.
- Force agents to prioritize "Deep Schema Discovery" (searching source code usages) over checking static type definition files.
- Ensure that if a conflict exists between `vite-env.d.ts` and source code usage, the usage wins.

**Non-Goals:**

- Automatically generating the schema (this remains an agent task).
- Changing the `@runtime-env/cli` behavior (this is a guidance-only change).

## Decisions

### Decision 1: Formalize "Avoiding the String Trap" in Skill Rules

We will update `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` to include a dedicated section or specific "Incorrect" example that highlights the misleading nature of `vite-env.d.ts`.

**Rationale:** By giving the anti-pattern a name ("String Trap"), we make it a recognizable concept for LLMs, making them more likely to avoid it when prompted.

### Decision 2: Prioritize "Usage over Declaration"

The guidance will explicitly state that `vite-env.d.ts` is a historical artifact.

**Rationale:** Agents are often trained to respect type definitions. We must explicitly give them permission to "ignore" or "override" these specific legacy files to achieve a better migration.

## Risks / Trade-offs

- **[Risk]** → Agents might misinterpret a string that "looks like" a number but is intended to stay a string.
- **[Mitigation]** → The guidance emphasizes looking for _explicit_ parsing calls (`parseInt`, `JSON.parse`) rather than just guessing based on values.

- **[Risk]** → Higher token usage during discovery as agents must grep for every variable.
- **[Mitigation]** → This is a necessary trade-off for high-quality migrations and "Clean Code" outcomes.
