graphviz-lambda
========
A simple web service that renders DOT files as svg. Forked from https://github.com/chrisns/graphviz-lambda

```console
$ curl https://pastebin.com/raw/muh0hTaF
digraph {
    A [label="여혐"];
    B [label="여성혐오"];
    C [label="문학계 여혐"];
    C [label="과학계 여혐"];
    A -> {B, C};
}

$ curl 'https://crtp5x4dz4.execute-api.ap-northeast-2.amazonaws.com/latest/svg?url=https://pastebin.com/raw/muh0hTaF'
```

![](https://crtp5x4dz4.execute-api.ap-northeast-2.amazonaws.com/latest/svg?url=https://pastebin.com/raw/muh0hTaF)

&nbsp;

Instructions
--------
```sh
# Prepare the AWS credentials

yarn
yarn claudia update
```
