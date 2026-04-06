# runtime-env docs

runtime-env helps frontend teams externalize runtime configuration so one build artifact can be reused across environments.

In Twelve-Factor terms, config should stay separate from code so you can build once and deploy anywhere.

@runtime-env/vite-plugin is the high-level Vite integration for dev, build, preview, and tests, while @runtime-env/cli is the low-level, framework-agnostic runtime tool for generating config, TypeScript declarations, and interpolated HTML/text across deployment, startup, and custom workflows.

## Vite lifecycle

Use the plugin during the Vite lifecycle for local development, build checks, preview verification, and tests.

- [Start Here](/start-here/what-is-runtime-env)
- [Vite quickstart](/vite/quickstart)
- [Vite builtin env comparison](/vite/builtin-env-comparison)

## Deployment/runtime lifecycle

After build output exists, real production environment work happens at deploy/startup time.

- [Production startup](/deployment/production-startup)

## CLI for any stack or workflow

The CLI is also usable outside deployment/runtime scripts, including custom pipelines, non-Vite stacks, and general schema-driven template substitution workflows.

- [CLI quickstart](/cli/quickstart)
- [CLI interpolate](/cli/interpolate)
