# Schema rules reference

## Structural rules

- root `type` must be `object`
- `properties` must be object
- `required` must be array of strings
- `default` is prohibited at any level

## Validation + parsing

- validation is performed with Ajv (+ formats)
- string type uses plain env string
- non-string types try `JSON.parse` first
- per-property validation errors are reported and aggregated
