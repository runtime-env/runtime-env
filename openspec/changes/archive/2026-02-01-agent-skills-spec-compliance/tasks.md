## 1. Specification Updates

- [x] 1.1 Update `openspec/specs/agent-skills/spec.md` to replace "Skill Workflow Standard" with "Skill Reference Standard" and update scenarios to align with the new standard.

## 2. Directory Restructuring

- [x] 2.1 Rename `skills/runtime-env-vite-plugin/workflows/` to `skills/runtime-env-vite-plugin/references/`.
- [x] 2.2 Move `skills/runtime-env-vite-plugin/guides/the-string-trap.md` to `skills/runtime-env-vite-plugin/references/`.
- [x] 2.3 Remove the now-empty `skills/runtime-env-vite-plugin/guides/` directory.

## 3. Skill Documentation Updates

- [x] 3.1 Update `skills/runtime-env-vite-plugin/SKILL.md` frontmatter to move `workflows` and `guides` fields into a `metadata` object.
- [x] 3.2 Update all relative links in `skills/runtime-env-vite-plugin/SKILL.md` to point to the new `references/` directory.

## 4. Verification

- [x] 4.1 Perform a project-wide search for any remaining references to the old `workflows/` or `guides/` paths within the `skills/runtime-env-vite-plugin/` directory.
- [x] 4.2 Verify that all links within the updated `SKILL.md` correctly point to existing files in the `references/` directory.
