# Use runtime public env in index.html

Use `<%= runtimeEnv.VAR_NAME %>` placeholders in `index.html` for dynamic values that should be interpolated at startup.

## Correct

- Any variable WITH the `VITE_` prefix (or the configured prefix) MUST use the `<%= runtimeEnv.VAR_NAME %>` syntax.
- Any variable WITHOUT the prefix (like `MODE`) MUST continue to use Vite's native `%VAR_NAME%` syntax.

```html
<!-- Prefixed variables -->
<p>Using data from <%= runtimeEnv.VITE_API_URL %></p>

<!-- Non-prefixed (built-in) variables -->
<p>Vite is running in %MODE%</p>
```

## Incorrect

```html
<!-- Don't use % syntax for prefixed variables -->
<p>Using data from %VITE_API_URL%</p>

<!-- Non-prefixed (built-in) variables -->
<p>Vite is running in <%= runtimeEnv.MODE %></p>
```
