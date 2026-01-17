## 1. Implementation

- [x] 1.1 Update `packages/next-plugin/src/components.tsx` to use `Script` from `next/script`.
- [x] 1.2 Set `strategy="beforeInteractive"` on the `Script` component.

## 2. Verification

- [x] 2.1 Verify that `examples/comprehensive-next` still works correctly (Build passed).
- [x] 2.2 Manually verify that the "<html> cannot contain a nested <script>" error is resolved if it was reproducible (Confirmed layout placement and next/script behavior).
