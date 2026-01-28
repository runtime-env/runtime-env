# Rule: Use runtime public env in index.html

Use `<%= runtimeEnv.PREFIX_VARIABLE_NAME %>` placeholders in `index.html` for dynamic values that should be interpolated at startup. Do NOT use Vite's build-time `%VARIABLE_NAME%` syntax.

**Correct:**

```html
<title><%= runtimeEnv.VITE_APP_TITLE %></title>
```

**Incorrect:**

```html
<title>%VITE_APP_TITLE%</title>
```
