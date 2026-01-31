## Context

Agents often enter a "Verification Blindness" loop when working with `@runtime-env/vite-plugin`. This happens because:

1. The plugin setup recommends adding the generated type file (e.g., `src/runtime-env.d.ts`) to `.gitignore`.
2. Agents are often configured (via `.geminiignore` or general instructions) to ignore gitignored files when using tools like `glob` or `ls`.
3. When an agent runs `npx runtime-env gen-ts`, the CLI reports success.
4. The agent then attempts to verify the file exists using `glob` or `ls`.
5. These tools return no results because the file is ignored.
6. The agent concludes the file was NOT generated and tries again, or gets stuck in a loop.

By explicitly instructing agents to TRUST the CLI output and NOT manually verify these files, we eliminate this loop.

## Goals / Non-Goals

**Goals:**

- Update `runtime-env-vite-plugin` skill rules to include "Trust the CLI" mandates.
- Prevent agents from performing redundant and error-prone verification of gitignored generated files.
- Improve agent reliability during project setup and environment variable modification.

**Non-Goals:**

- Modifying the `@runtime-env/cli` or `@runtime-env/vite-plugin` code.
- Changing how `.gitignore` works.

## Decisions

### 1. Update `setup-runtime-env-plugin.md`

- Add a "Trust the CLI" tip/callout.
- Update Step 7 (Generate types) to explicitly forbid manual verification if the file is gitignored.

### 2. Update `add-new-environment-variables.md`

- Update the "Correct" section to include a mandate for trusting CLI output and avoiding manual verification.

### 3. Emphasize "MUST TRUST" language

- Use strong RFC-style keywords (MUST, MUST NOT) to ensure agents follow the instruction even if it contradicts their default "verify everything" heuristic.

## Risks / Trade-offs

- **[Risk]** The CLI might actually fail while reporting success. -> **[Mitigation]** This is a bug in the CLI that should be fixed there. For the agent's purpose, the CLI output is the most reliable source of truth for its own actions.
- **[Risk]** Agents might still try to verify due to "Verification Blindness" being a deep-seated behavior. -> **[Mitigation]** Placing the instruction directly in the rule they are currently following is the most effective way to override this behavior.
