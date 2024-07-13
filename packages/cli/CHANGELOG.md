# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0](https://github.com/runtime-env/runtime-env/compare/v0.5.0...1.0.0) (2024-07-13)


### ⚠ BREAKING CHANGES

* The configuration file has been removed. Please use command line options instead.
* support node SEA

### Features

* add command description ([#52](https://github.com/runtime-env/runtime-env/issues/52)) ([0e43bc3](https://github.com/runtime-env/runtime-env/commit/0e43bc33ef3e92e574b6a588168569f9d39d2dd4))
* better error message ([#10](https://github.com/runtime-env/runtime-env/issues/10)) ([9a4f85f](https://github.com/runtime-env/runtime-env/commit/9a4f85face8bd289cedf8fba6cc5693c0ad8e19a))
* clone import-meta-env ([fa9c44e](https://github.com/runtime-env/runtime-env/commit/fa9c44eb91a09013bf7ce3f30e013f872d5a0e8c))
* implement ([7643553](https://github.com/runtime-env/runtime-env/commit/764355319b160ba5660e6ce40020bbcca11ace0b))
* interpolate ([#38](https://github.com/runtime-env/runtime-env/issues/38)) ([9d554e5](https://github.com/runtime-env/runtime-env/commit/9d554e5dd1d599329356d76c5fedc43ad81d939e))
* interpolate from/to file ([#42](https://github.com/runtime-env/runtime-env/issues/42)) ([9975546](https://github.com/runtime-env/runtime-env/commit/9975546e925f4e9bc0b09d63b32096e2d079631e))
* json schema ([#21](https://github.com/runtime-env/runtime-env/issues/21)) ([ee7abd2](https://github.com/runtime-env/runtime-env/commit/ee7abd28af28ca08d1beb520e7be2850bb59d8d3))
* multiple env files ([#36](https://github.com/runtime-env/runtime-env/issues/36)) ([c92f8fc](https://github.com/runtime-env/runtime-env/commit/c92f8fcaa93f50f8dd0f1aed554744c6a80ca380))
* support node SEA ([b9af173](https://github.com/runtime-env/runtime-env/commit/b9af173f90558a1b4bbf59b096c3bf1d6213698c))
* throw all errors not just first one ([#27](https://github.com/runtime-env/runtime-env/issues/27)) ([9e10808](https://github.com/runtime-env/runtime-env/commit/9e10808c970c2d9e3453f591dacc1531a156d53c))
* throw human readable error if no configuration found ([#7](https://github.com/runtime-env/runtime-env/issues/7)) ([a2f5dee](https://github.com/runtime-env/runtime-env/commit/a2f5deed5671af904d430f71b6fac3c38509e093))
* v0.5 ([#63](https://github.com/runtime-env/runtime-env/issues/63)) ([f557b74](https://github.com/runtime-env/runtime-env/commit/f557b748dd2e45346e06bd8927f1f8836887d156))


### Bug Fixes

* [#55](https://github.com/runtime-env/runtime-env/issues/55) ([128e16d](https://github.com/runtime-env/runtime-env/commit/128e16dabb602a26c15ddddfb2eac5b80ea74e83))
* **deps:** update dependency ajv-formats to v3 ([#108](https://github.com/runtime-env/runtime-env/issues/108)) ([9ce86f6](https://github.com/runtime-env/runtime-env/commit/9ce86f6d3d407a48f0ecae7565f64835385e3dfc))
* **deps:** update dependency commander to v12 ([#109](https://github.com/runtime-env/runtime-env/issues/109)) ([0bd88ef](https://github.com/runtime-env/runtime-env/commit/0bd88effb88b8adf73dae96952dac75d72af544c))
* **deps:** update dependency picocolors to v1.0.1 ([#88](https://github.com/runtime-env/runtime-env/issues/88)) ([d520c4e](https://github.com/runtime-env/runtime-env/commit/d520c4e467f792be62cd5949364808f2fe0ad615))
* **deps:** update dependency serialize-javascript to v6.0.2 ([#89](https://github.com/runtime-env/runtime-env/issues/89)) ([b2c6a0d](https://github.com/runtime-env/runtime-env/commit/b2c6a0d16b2de5d01d9edaaa9fc36be2619e1ca1))
* fallback to empty string if env var does not exits ([#40](https://github.com/runtime-env/runtime-env/issues/40)) ([6006caa](https://github.com/runtime-env/runtime-env/commit/6006caab0b19c37ac9904839e92c5c6c610f668c))
* it should also escape structural data ([#32](https://github.com/runtime-env/runtime-env/issues/32)) ([4727214](https://github.com/runtime-env/runtime-env/commit/47272148d8a97483eaa7cd5b68ee2b691bc63ad1))
* prepend shebang ([#56](https://github.com/runtime-env/runtime-env/issues/56)) ([128e16d](https://github.com/runtime-env/runtime-env/commit/128e16dabb602a26c15ddddfb2eac5b80ea74e83)), closes [#55](https://github.com/runtime-env/runtime-env/issues/55)
* quote ([033f5a3](https://github.com/runtime-env/runtime-env/commit/033f5a324fc040c6636e991bf277dec7482e2a2a))
* serialize ([41a9e10](https://github.com/runtime-env/runtime-env/commit/41a9e10986ffaf6bbeab9fad2f4b06fa32d44162))
* validate variable name ([#5](https://github.com/runtime-env/runtime-env/issues/5)) ([eb17099](https://github.com/runtime-env/runtime-env/commit/eb1709938d59b6f727267b6871f5d6516ef065d4))

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
