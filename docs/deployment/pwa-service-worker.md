# PWA and service worker notes

PWAs can accidentally cache runtime config.

## Risks

- service worker precache captures `runtime-env.js`,
- clients keep old runtime values after deploy.

## Mitigations

- exclude `runtime-env.js` from precache,
- or patch runtime-env revision at startup,
- verify update flow in real browser sessions.
