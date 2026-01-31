## 1. Update Core Skill Definition

- [x] 1.1 Update `skills/runtime-env-vite-plugin/SKILL.md` to include a "Strict Prohibitions" section under Core Mandates.
- [x] 1.2 Formally forbid modifying `.env` files, adding `import` statements for `runtimeEnv`, and adding redundant CLI scripts to `package.json`.

## 2. Refine Setup Documentation

- [x] 2.1 Update `skills/runtime-env-vite-plugin/references/01-setup.md` to emphasize "minimal intervention" for `vite.config.ts`.
- [x] 2.2 Add explicit instructions to preserve existing Vite configurations and avoid redundant scripts in `package.json`.

## 3. Enhance Discovery Documentation

- [x] 3.1 Update `skills/runtime-env-vite-plugin/references/02-discovery.md` with "Deep Schema Discovery" guidelines.
- [x] 3.2 Add scenarios for identifying Enums from `switch` statements and Arrays from `.split()` usage.
- [x] 3.3 Add prohibition against generic `{"type": "object"}` schemas without properties.

## 4. Expand String Trap Guide

- [x] 4.1 Update `skills/runtime-env-vite-plugin/references/the-string-trap.md` with comprehensive JSON type comparison tables.
- [x] 4.2 Add examples for Enum and Array discovery and implementation.
- [x] 4.3 Add a section on "Deep Discovery" for complex objects with specific properties.
