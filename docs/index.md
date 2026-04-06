# runtime-env docs

runtime-env lets you ship one frontend build and inject environment-specific values later in the real production environment.

Like Twelve-Factor config, runtime settings should be externalized so you can build once and deploy anywhere without rebuilding for each environment.

@runtime-env/vite-plugin is the high-level Vite integration for dev, build, preview, and tests, while @runtime-env/cli is the low-level, framework-agnostic runtime tool for generating config, TypeScript declarations, and interpolated HTML/text during deployment or startup.

## Two lifecycles

### Vite lifecycle

Use the plugin to support local development, test runs, build-time checks, and preview validation.

- [Start Here](/start-here/what-is-runtime-env)
- [Vite quickstart](/vite/quickstart)

### Deployment/runtime lifecycle

After build output exists, use the CLI at deploy/startup time to generate runtime config and interpolate HTML/text as needed.

- [CLI quickstart](/cli/quickstart)
- [Production startup](/deployment/production-startup)
- [Interpolate command](/cli/interpolate)
