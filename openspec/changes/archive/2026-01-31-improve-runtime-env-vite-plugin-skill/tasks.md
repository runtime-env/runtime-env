## 1. Update Setup Rule

- [x] 1.1 Update `skills/runtime-env-vite-plugin/rules/setup-runtime-env-plugin.md` with explicit `gen-ts` command.
- [x] 1.2 Add guidance for updating `package.json` build scripts to run `vite build && tsc`.
- [x] 1.3 Add instruction to keep existing environment files (`.env`, etc.) intact.
- [x] 1.4 Correct `.gitignore` instructions for `runtime-env.d.ts`.

## 2. Update Environment Variables Rule

- [x] 2.1 Update `skills/runtime-env-vite-plugin/rules/add-new-environment-variables.md` with mandatory `gen-ts` step.

## 3. Update Usage Rule

- [x] 3.1 Update `skills/runtime-env-vite-plugin/rules/use-runtime-public-env-in-js-ts.md` with troubleshooting steps for missing types.

## 4. Verification

- [x] 4.1 Verify all updated rules follow the H1 -> Description -> Correct -> Incorrect format.
- [x] 4.2 Run `openspec verify` to ensure implementation matches specs.
