# Custom global name

Use `--global-variable-name` to rename the exported global object.

## Example

```bash
npx @runtime-env/cli --global-variable-name appConfig gen-js --output-file ./public/runtime-env.js
```

Then access values through `globalThis.appConfig`.
