## MODIFIED Requirements

### Requirement: Manual Script Injection

The plugin SHALL provide a `<RuntimeEnvScript />` component that users MUST manually add to their root layout (App Router) or document (Pages Router) to enable client-side environment variable access.

#### Scenario: next/script usage

- **GIVEN** a Next.js project with `withRuntimeEnv` configured
- **AND** the user has added `<RuntimeEnvScript />` to their application
- **WHEN** the component is rendered
- **THEN** it SHALL use the `Script` component from `next/script` to inject environment variables
- **AND** it SHALL ensure variables are populated on the client before other scripts execute
- **AND** it SHALL NOT cause nesting errors (e.g., "<html> cannot contain a nested <script>") by allowing Next.js to manage the script's placement via the `Script` component.
