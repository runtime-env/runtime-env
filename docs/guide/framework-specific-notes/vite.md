# Vite

## Env Variables and Modes

During production, the following environment variables are still statically replaced:

- [Built-in](https://vitejs.dev/guide/env-and-mode.html#env-variables) variables: `MODE`, `BASE_URL`, `PROD`, `DEV`, and `SSR`.

- [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#vitejsplugin-legacy-:~:text=Inject%20the%20import.meta.env.LEGACY%20env%20variable%2C%20which%20will%20only%20be%20true%20in%20the%20legacy%20production%20build%2C%20and%20false%20in%20all%20other%20cases.) variable: `LEGACY`.

- [envPrefix](https://vitejs.dev/config/shared-options.html#envprefix)-ed variables.
