# Recipe: nested JSON config

Schema:

```json
{
  "type": "object",
  "properties": {
    "FEATURE_FLAGS": {
      "type": "object",
      "properties": {
        "betaCheckout": { "type": "boolean" }
      },
      "required": ["betaCheckout"]
    }
  },
  "required": ["FEATURE_FLAGS"]
}
```

Env value:

```bash
FEATURE_FLAGS={"betaCheckout":true}
```
