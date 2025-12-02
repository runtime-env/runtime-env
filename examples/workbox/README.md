# Usage

```sh
$ docker build . -t runtime-env-example
$ docker run -it --rm -p 3000:80 -e FOO=v1 runtime-env-example
```
