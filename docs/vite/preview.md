# Vite preview

`vite preview` is useful for verification before deployment.

## What it does during preview

- generates `runtime-env.js` when the preview server starts,
- interpolates built HTML when the preview server starts,
- keeps preview behavior close to runtime expectations without mutating source setup.

Restart the preview server after changing `.env` files or the schema.

Preview is for verification, not a real production runtime.
