# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.1](https://github.com/runtime-env/runtime-env/compare/cli0.6.0...cli0.6.1) (2024-09-28)


### Bug Fixes

* interpolation should only handle strings and must not slice other types ([#187](https://github.com/runtime-env/runtime-env/issues/187)) ([cf0e45f](https://github.com/runtime-env/runtime-env/commit/cf0e45f3505f8aa44b158c9ca20ddca0c46a7d91))

## [0.6.0](https://github.com/runtime-env/runtime-env/compare/cli0.5.3...cli0.6.0) (2024-09-28)


### ⚠ BREAKING CHANGES

* `--input-file-path` is renamed to `--input-file`
* `--output-file-path` is renamed to `--output-file`
* `--env-schema-file-path` is renamed to `--schema-file`

### Features

* align naming conventions with Node's `--env-file` ([#181](https://github.com/runtime-env/runtime-env/issues/181)) ([dcd1e96](https://github.com/runtime-env/runtime-env/commit/dcd1e96d7b4d58a5983c39fdbb2dc6164eaa2e53))
* better error message ([#180](https://github.com/runtime-env/runtime-env/issues/180)) ([1738b73](https://github.com/runtime-env/runtime-env/commit/1738b73f8d5fca8b20819f2a360fb9a47ac3a92b))
* integrate built-in .env file support ([#182](https://github.com/runtime-env/runtime-env/issues/182)) ([3e73f7a](https://github.com/runtime-env/runtime-env/commit/3e73f7a36a88344df4324693dac6c8e6bf048d93)), closes [#176](https://github.com/runtime-env/runtime-env/issues/176)

## [0.5.3](https://github.com/runtime-env/runtime-env/compare/cli0.5.2...cli0.5.3) (2024-09-14)


### Bug Fixes

* **deps:** update dependency json-schema-to-typescript to v15 ([#132](https://github.com/runtime-env/runtime-env/issues/132)) ([349ac18](https://github.com/runtime-env/runtime-env/commit/349ac18ff00006e9f25a89fd3b66d6ef4da518b2))
* **deps:** update dependency picocolors to v1.1.0 ([#156](https://github.com/runtime-env/runtime-env/issues/156)) ([bc76c66](https://github.com/runtime-env/runtime-env/commit/bc76c667618bcbf44241871be709b4c51d795ea7))

## [0.5.2](https://github.com/runtime-env/runtime-env/compare/cli0.5.1...cli0.5.2) (2024-08-25)


### Bug Fixes

* make runtimeEnv accessible via globalThis ([#151](https://github.com/runtime-env/runtime-env/issues/151)) ([cb7278f](https://github.com/runtime-env/runtime-env/commit/cb7278f6d04dca928a4732f2b8471d23348f6205)), closes [#150](https://github.com/runtime-env/runtime-env/issues/150)

## [0.5.1](https://github.com/runtime-env/runtime-env/compare/cli0.5.0...cli0.5.1) (2024-07-13)


### Bug Fixes

* **deps:** update dependency ajv-formats to v3 ([#108](https://github.com/runtime-env/runtime-env/issues/108)) ([9ce86f6](https://github.com/runtime-env/runtime-env/commit/9ce86f6d3d407a48f0ecae7565f64835385e3dfc))
* **deps:** update dependency commander to v12 ([#109](https://github.com/runtime-env/runtime-env/issues/109)) ([0bd88ef](https://github.com/runtime-env/runtime-env/commit/0bd88effb88b8adf73dae96952dac75d72af544c))
* **deps:** update dependency picocolors to v1.0.1 ([#88](https://github.com/runtime-env/runtime-env/issues/88)) ([d520c4e](https://github.com/runtime-env/runtime-env/commit/d520c4e467f792be62cd5949364808f2fe0ad615))
* **deps:** update dependency serialize-javascript to v6.0.2 ([#89](https://github.com/runtime-env/runtime-env/issues/89)) ([b2c6a0d](https://github.com/runtime-env/runtime-env/commit/b2c6a0d16b2de5d01d9edaaa9fc36be2619e1ca1))

## [0.5.0](https://github.com/runtime-env/runtime-env/compare/cli0.4.1...cli0.5.0) (2024-03-28)


### ⚠ BREAKING CHANGES

* Parsing of .env files has been removed. Please load environment variables to the user environment before running the runtime-env CLI.
* The configuration file has been removed. Please use command line options instead.

### Features

* v0.5 ([#63](https://github.com/runtime-env/runtime-env/issues/63)) ([f557b74](https://github.com/runtime-env/runtime-env/commit/f557b748dd2e45346e06bd8927f1f8836887d156))

### [0.4.1](https://github.com/runtime-env/runtime-env/compare/cli0.4.0...cli0.4.1) (2024-02-18)


### Bug Fixes

* prepend shebang ([#56](https://github.com/runtime-env/runtime-env/issues/56)) ([128e16d](https://github.com/runtime-env/runtime-env/commit/128e16dabb602a26c15ddddfb2eac5b80ea74e83)), closes [#55](https://github.com/runtime-env/runtime-env/issues/55)

## [0.4.0](https://github.com/runtime-env/runtime-env/compare/cli0.3.1...cli0.4.0) (2024-01-27)


### ⚠ BREAKING CHANGES

* migrate to webpack

### Features

* add command description ([#52](https://github.com/runtime-env/runtime-env/issues/52)) ([0e43bc3](https://github.com/runtime-env/runtime-env/commit/0e43bc33ef3e92e574b6a588168569f9d39d2dd4))
* support node SEA ([b9af173](https://github.com/runtime-env/runtime-env/commit/b9af173f90558a1b4bbf59b096c3bf1d6213698c))

### [0.3.2](https://github.com/runtime-env/runtime-env/compare/cli0.3.1...cli0.3.2) (2024-01-20)


### Features

* add command description ([#52](https://github.com/runtime-env/runtime-env/issues/52)) ([0e43bc3](https://github.com/runtime-env/runtime-env/commit/0e43bc33ef3e92e574b6a588168569f9d39d2dd4))

## [0.3.0](https://github.com/runtime-env/runtime-env/compare/cli0.2.3...cli0.3.0) (2024-01-05)


### Features

* interpolate ([#38](https://github.com/runtime-env/runtime-env/issues/38)) ([9d554e5](https://github.com/runtime-env/runtime-env/commit/9d554e5dd1d599329356d76c5fedc43ad81d939e))
