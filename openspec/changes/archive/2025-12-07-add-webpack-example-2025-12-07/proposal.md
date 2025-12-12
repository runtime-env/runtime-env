# Proposal: Add comprehensive webpack example

## Why

The project currently has a comprehensive example using Vite (`comprehensive-vite`), but many projects still use Webpack as their build tool. A comprehensive webpack example would:

1. Demonstrate that `@runtime-env/cli` works seamlessly with Webpack-based projects
2. Provide a reference implementation for webpack users migrating to or adopting runtime-env
3. Cover the same workflows as `comprehensive-vite` but adapted to webpack's ecosystem
4. Show webpack-specific patterns like HtmlWebpackPlugin integration and workbox-webpack-plugin for PWA support

The existing `workbox` example demonstrates PWA functionality with webpack, but lacks the complete workflow coverage (development mode, testing, TypeScript, etc.) that `comprehensive-vite` provides.

## What Changes

Create a new `examples/comprehensive-webpack` directory that mirrors the structure and functionality of `comprehensive-vite`, but uses:

- **Webpack** instead of Vite as the build tool
- **webpack-dev-server** for development mode with live reloading
- **html-webpack-plugin** for HTML processing
- **workbox-webpack-plugin** for PWA/service worker generation
- **ts-loader** for TypeScript compilation
- **Jest** for testing (aligned with webpack ecosystem)

The example MUST demonstrate:

- Development workflow with watch mode and live reload
- TypeScript type safety with generated declarations
- HTML interpolation with runtime environment placeholders
- Production builds optimized for deployment
- Testing with proper runtime-env loading
- Docker deployment with SEA binaries
- PWA support with service worker cache busting for runtime-env.js

## Scope

This change focuses solely on creating the new webpack example. It does not:

- Modify the CLI tool itself
- Change existing examples
- Add new CLI features
- Modify project documentation outside the example's README

## Dependencies

- Requires `@runtime-env/cli` with existing `gen-ts`, `gen-js`, and `interpolate` commands
- Uses standard webpack v5 ecosystem packages
- Follows the same Docker/nginx deployment pattern as other examples
