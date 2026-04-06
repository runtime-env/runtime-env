# Recipe: static site usage

For static hosting, generate `runtime-env.js` before serving the folder.

- Keep compiled assets unchanged.
- Replace only runtime config payload at deploy/start time.
- If HTML needs runtime substitution, run [CLI interpolate](/cli/interpolate) during startup.
