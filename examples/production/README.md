# Usage

```sh
$ docker build . -t runtime-env-example
$ docker run -it --rm -p 3000:80 -e FOO=production runtime-env-example
```
