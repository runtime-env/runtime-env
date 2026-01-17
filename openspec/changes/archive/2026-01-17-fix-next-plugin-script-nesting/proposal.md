# Change: Fix Next.js plugin script nesting error

## Why

The current implementation of `<RuntimeEnvScript />` in `@runtime-env/next-plugin` uses a raw `<script>` tag. When users place this component inside the `<html>` tag (e.g., in a root layout) but outside of `<head>` or `<body>`, it results in a hydration error or validation warning: `<html> cannot contain a nested <script>`. Using `next/script` with an appropriate strategy (e.g., `beforeInteractive`) will allow Next.js to manage the script's placement correctly and avoid this issue.

## What Changes

- **RuntimeEnvScript**: Update `packages/next-plugin/src/components.tsx` to use `next/script` instead of a raw `<script>` tag.
- **Strategy**: Use `strategy="beforeInteractive"` to ensure environment variables are available as early as possible.

## Impact

- Affected specs: `next-plugin`
- Affected code: `packages/next-plugin/src/components.tsx`
