## Context

The current format for agent skill rules is somewhat flexible, which can lead to inconsistency. A stricter format is desired to ensure rules are atomic, easy to parse, and provide clear "before/after" or "right/wrong" examples.

## Goals

- Enforce a strict structure for rule markdown files.
- Minimize noise in rule files by limiting content to essential elements.
- Ensure every rule has a clear "Correct" and "Incorrect" example.

## Decisions

### Decision: Strict Rule Structure

Every rule markdown file will be restricted to:

1.  H1 Title
2.  Brief description
3.  `## Correct` H2 section
4.  `## Incorrect` H2 section

The H2 sections provide flexibility to include multiple code blocks or nested sub-sections when a single code block is insufficient to demonstrate a scenario (e.g., multi-file changes or complex configurations).

## Migration Plan

Existing rules in `skills/runtime-env-vite-plugin/rules/` will be refactored to comply with this new structure. This may involve splitting complex rules or condensing information.
