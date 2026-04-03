# Recipe: third-party script URLs

Use `interpolate` for HTML snippets that need runtime URLs.

```html
<script src="<%= runtimeEnv.ANALYTICS_SCRIPT_URL %>"></script>
```

Generate interpolated output at startup with CLI `interpolate`.
