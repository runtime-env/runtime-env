# Watch mode

`--watch` is a shared top-level CLI option.

## Example

```bash
npx @runtime-env/cli --watch gen-js --env-file .env --output-file ./public/runtime-env.js
```

Behavior:

- `gen-js` watches schema and env files.
- `gen-ts` watches schema.
- `interpolate` watches schema, env files, and input file (if provided).
