# CLI schema rules

The CLI enforces schema constraints before generation.

## Required structure

- Root `type` must be `"object"`.
- `properties` must be an object.
- `required` must be an array.
- Every `required[]` item must be a string.
- `default` keyword is prohibited anywhere in schema.

## Value parsing behavior

- String-typed properties read raw strings.
- Non-string properties try `JSON.parse` on env values first.
- Validation uses Ajv.
