## Context

The current agent skill for `runtime-env-vite-plugin` is too passive regarding type generation. It assumes the plugin will handle everything during the Vite build process, which is often too late for tools like `tsc`. This leads to confusion and build failures when agents implementation tasks.

## Goals / Non-Goals

**Goals:**

- Make manual type generation a standard part of the agent's workflow for setup and updates.
- Provide clear guidance on build script ordering to prevent `tsc` failures.
- Align `.gitignore` guidance with common project practices.

**Non-Goals:**

- Changing the plugin's code (this change is only for the agent skill documentation).

## Decisions

### Explicit Manual Generation

Agents must be instructed to run `npx runtime-env gen-ts --output-file src/runtime-env.d.ts` manually.
**Rationale:** This ensures the IDE and compiler have immediate access to the types without waiting for a server start or a full build. This is especially critical when an agent or user is modifying the schema or environment variables but does not want to incur the overhead of starting a development server just to fix type errors. Manual generation provides a lightweight way to keep types in sync with the schema.

### Build Script Ordering

The skill will recommend updating `package.json` to run `vite build` before `tsc`.
**Rationale:** Standard Vite/React projects run `tsc && vite build`. Since `tsc` requires the types, and `vite build` triggers the plugin that generates them, reversing the order (or running `gen-ts` explicitly) resolves the dependency. Running `vite build && tsc` is a clean way to ensure bundling happens (generating types) followed by a full type check.

### Update .gitignore Guidance

The guidance will change from "MUST NOT ignore" to "SHOULD ignore".
**Rationale:** Generated files that can be easily recreated should typically be ignored to keep the repository clean and avoid merge conflicts on generated artifacts.

### Keep Environment Files Intact

The skill will explicitly state that `.env` files must not be deleted.
**Rationale:** `runtime-env` uses these files as the source of truth for variables during development and builds. Some agents might mistakenly think that migrating to `.runtimeenvschema.json` means the original `.env` files are no longer needed.

## Risks / Trade-offs

- [Risk] Agents might forget to run the manual command.
  - **Mitigation**: Include it as a mandatory step in the "Correct" sections of multiple rules.
- [Risk] Different projects might use different output paths for `.d.ts`.
  - **Mitigation**: Stick to the opinionated default `src/runtime-env.d.ts` as specified in the plugin's documentation.
