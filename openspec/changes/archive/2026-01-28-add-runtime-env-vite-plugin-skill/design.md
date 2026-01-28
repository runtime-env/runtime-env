# Design: Agent Skills for runtime-env

## Context

As the project grows, it becomes important to guide AI agents (like this one) on the correct usage of `runtime-env`. Vite projects have a specific nuance where `import.meta.env` is used for build-time variables, while `runtime-env` is used for runtime variables. Agents often confuse these or try to replace one with the other.

## Goals

- Provide a standardized way to define agent skills within the repository.
- Ensure skills are easily discoverable by agents.
- Leverage standard tooling (`npx skills init`) for skill creation.

## Decisions

### Skill Location: `/skills`

We will store skills in a top-level `/skills` directory. This keeps them separate from code while making them highly visible to agents exploring the root.

### Skill Format: `SKILL.md`

Each skill will have a `SKILL.md` file following the Vercel Agent Skills structure. This structure is designed for readability and effective instruction-following by LLMs.

### Tooling: `npx skills init`

We will use `npx skills init` to bootstrap skill directories. This ensures that the generated `SKILL.md` and any supporting files conform to the expected standard.

## Risks / Trade-offs

- **Redundancy**: Some instructions in `SKILL.md` might overlap with `README.md` or `AGENTS.md`. However, `SKILL.md` is specifically tuned for agent consumption.
- **Maintenance**: Documentation in `SKILL.md` must be kept in sync with code changes.

## Open Questions

- Should we also include examples or test cases within the skill directory?
