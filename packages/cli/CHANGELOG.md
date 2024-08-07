# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
