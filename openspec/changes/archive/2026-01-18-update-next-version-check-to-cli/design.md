## Context

The `@runtime-env/next-plugin` needs to know the Next.js version to adapt its configuration (e.g., for Turbopack).

## Decisions

- **Decision**: Use `spawnSync("npx", ["next", "-v"])` (or similar) to get the version.
- **Rationale**: `require("next/package.json")` is brittle in some environments. The CLI is the source of truth for the running Next.js instance.
- **Implementation**:
  ```typescript
  export function getNextVersion(): string | null {
    try {
      // Try using npx next -v to get the version
      const result = spawnSync("npx", ["next", "-v"], { encoding: "utf8" });
      if (result.status === 0) {
        // Output format: "Next.js v16.1.3" or "v16.1.3"
        const match = result.stdout.match(/v(\d+\.\d+\.\d+)/);
        return match ? match[1] : null;
      }
    } catch (e) {
      // Fallback or ignore
    }
    return null;
  }
  ```

## Risks / Trade-offs

- **Performance**: Spawning a process is slower than `require`. However, this is only done during initialization (dev server start or build), so the impact is negligible.
- **Dependency on npx/next**: Assumes `next` or `npx next` is available in the environment. This is a safe assumption for a Next.js project.
