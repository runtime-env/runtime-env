# Docker deployment

Use runtime generation at container startup.

## Pattern

1. Build static assets during image build.
2. At container startup, run `gen-js` using container env vars.
3. Serve static files.

This keeps one image reusable across environments.
