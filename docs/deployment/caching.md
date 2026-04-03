# Caching strategy

Do not cache `runtime-env.js` aggressively.

## Recommendation

- Use short cache lifetime or no-store for `runtime-env.js`.
- Keep long immutable caching for bundled assets (`app.[hash].js`, etc.).

If `runtime-env.js` is cached too long, users may see stale configuration.
