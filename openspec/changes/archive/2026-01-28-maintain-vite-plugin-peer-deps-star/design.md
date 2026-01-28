# Design: Maintain vite-plugin peer dependencies as star (\*) and dev dependencies as major range

## Context

The `@runtime-env/vite-plugin` package needs to be highly compatible with various versions of its peer dependencies (`vite`, `vitest`, and `@runtime-env/cli`). Using `*` for these peer dependencies ensures that consumers aren't forced into specific versions that might conflict with their own project's requirements.

Simultaneously, we want to allow `devDependencies` in `packages/vite-plugin` to follow major version ranges (e.g., `^7.0.0` for `vite`) to receive non-breaking updates automatically, while keeping the main repository's pinning strategy for other packages if possible.

## Decisions

### 1. Renovate Configuration for Peer Dependencies

We will add a `packageRule` to `renovate.json` to explicitly prevent Renovate from managing `peerDependencies`. Since we want these to remain as `*`, we don't need automated updates for them.

```json
{
  "packageRules": [
    {
      "matchDepTypes": ["peerDependencies"],
      "enabled": false
    }
  ]
}
```

### 2. Renovate Configuration for vite-plugin devDependencies

We will add a `packageRule` to target `packages/vite-plugin/package.json` and set its `rangeStrategy` to `bump`. This will allow Renovate to update the version within the range (e.g., `^7.0.0` -> `^7.1.0`) instead of pinning it to a single version (e.g., `7.1.0`).

```json
{
  "packageRules": [
    {
      "matchPaths": ["packages/vite-plugin/package.json"],
      "matchDepTypes": ["devDependencies"],
      "rangeStrategy": "bump"
    }
  ]
}
```

### 3. Manual Update of package.json

We will manually update `packages/vite-plugin/package.json` to change `vite` and `vitest` in `devDependencies` from pinned versions to `^X.0.0` ranges.

## Risks / Trade-offs

- **Range Strategy**: Using `bump` for `devDependencies` in `vite-plugin` means that different packages in the monorepo might have different versioning strategies (pinned vs ranged). This is acceptable given the specific compatibility needs of the plugin.
- **Peer Dependencies**: `*` is extremely permissive. While this maximizes compatibility, it also means we don't explicitly document the _minimum_ required version if there is one. Given the current design, `*` is preferred.
