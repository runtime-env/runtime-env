# Usage

```sh
$ docker build . -t runtime-env-example
$ docker run --publish 3000:80 --env FOO=production runtime-env-example
```
