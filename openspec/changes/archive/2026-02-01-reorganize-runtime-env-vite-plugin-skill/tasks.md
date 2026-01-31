## 1. Directory Restructuring

- [x] 1.1 Create `skills/runtime-env-vite-plugin/workflows` directory
- [x] 1.2 Create `skills/runtime-env-vite-plugin/guides` directory

## 2. Implement Guides

- [x] 2.1 Create `skills/runtime-env-vite-plugin/guides/the-string-trap.md` explaining the pattern and how to avoid it with `runtimeEnv`.

## 3. Implement Sequential Workflows

- [x] 3.1 Create `skills/runtime-env-vite-plugin/workflows/01-setup.md` based on `setup-runtime-env-plugin.md`. Include "Prerequisites" and "Verification" blocks.
- [x] 3.2 Create `skills/runtime-env-vite-plugin/workflows/02-discovery.md` focusing on codebase analysis, identifying environment variables, and finding manual parsing logic.
- [x] 3.3 Create `skills/runtime-env-vite-plugin/workflows/03-migration.md` combining logic from `use-runtime-public-env-in-js-ts.md`, `use-runtime-public-env-in-index-html.md`, and `add-new-environment-variables.md`. Enforce prerequisites (completion of 01 and 02).

## 4. Finalize and Cleanup

- [x] 4.1 Update `skills/runtime-env-vite-plugin/SKILL.md` to point to the new workflow files and update "When to apply" logic.
- [x] 4.2 Remove the legacy `skills/runtime-env-vite-plugin/rules` directory.
- [x] 4.3 Verify the new skill structure by running a test implementation (if applicable).
