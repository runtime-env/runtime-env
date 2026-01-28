---
name: runtime-env-vite-plugin
description: Guidance on using runtime-env with Vite to distinguish between runtime and build-time environment variables.
rules:
  - ./rules/setup-runtime-env-plugin.md
  - ./rules/use-runtime-public-env-in-js-ts.md
  - ./rules/use-runtime-public-env-in-index-html.md
  - ./rules/add-new-environment-variables.md
---

# runtime-env-vite-plugin

This skill ensures that environment variables are handled correctly in Vite projects by distinguishing between build-time (static) variables and runtime (dynamic) variables.

## When to apply

Reference these guidelines when:

- Setting up a Vite project that requires environment variables.
- Writing code that accesses environment variables in a Vite project.
- Configuring `index.html` that uses environment variables.
- Refactoring existing Vite projects to properly use runtime environment variables.
- Reviewing code for proper environment variable usage in Vite projects.
- Optimizing CI/CD pipelines

## Overview

Use this skill when working on a Vite-based project that uses `@runtime-env/vite-plugin`. It provides guidance on configuration, usage in code, and usage in `index.html`.

## Rules

- **[Setup runtime-env plugin](./rules/setup-runtime-env-plugin.md)**: How to configure Vite, `index.html`, and the schema.
- **[Use runtime public env in JS/TS](./rules/use-runtime-public-env-in-js-ts.md)**: How to access dynamic variables in your code.
- **[Use runtime public env in index.html](./rules/use-runtime-public-env-in-index-html.md)**: How to use interpolation in your HTML.
- **[Add new environment variables](./rules/add-new-environment-variables.md)**: How to add new variables with proper types and validation.
