# 被り負けチェッカーTSユーティリティー on TypeScript

[GitHub Repository](https://github.com/tukinami/kaburimake-checker-utils-ts)

[被り負けチェッカーTS](https://github.com/tukinami/kaburimake-checker-ts)用のユーティリティ・ツールです。

## 使用に必要なもの

- [Node.js(と付属の`npm`)](https://nodejs.org)

## 使い方

まず、このレポジトリをダウンロードして、置きたい場所に展開しておいてください。

レポジトリのダウンロードは、レポジトリトップの`Code`ボタンの中にある`Download ZIP`から行なえると思います。

展開したディレクトリの場所を、仮に`path/to/kaburimake-checker-utils-ts`とします。

### `path/to/kaburimake-checker-utils-ts`から起動する方法

1. コマンドプロンプト、PowerShellなどのシェルで、`path/to/kaburimake-checker-utils-ts`に移動します。
2. `npm install` とし、必要なファイルをインストールします。
3. `npm exec kaburimake-checker-utils-ts`と入力し、決定します
4. 使い方が出てくるので、`npm exec kaburimake-checker-utils-ts -- `と入力し、次に使いたい機能を入力して使用します。

例:

``` Powershell
PS path\to\kaburimake-checker-utils-ts> npm exec kaburimake-checker-utils-ts -- --version
0.1.0
```

### どこからでも使えるようにする方法

1. コマンドプロンプト、PowerShellなどのシェルで、`path/to/kaburimake-checker-utils-ts`に移動します。
2. `npm install` とし、必要なファイルをインストールします。
3. `npm link`と入力して決定すると、シェルで`kaburimake-checker-utils-ts`と入力すると、どこからでも使えるようになります。
4. `kaburimake-checker-utils-ts`と入力し、出てきた使い方にそって、次に使いたい機能を入力して使用します。

例: 登録

``` PowerShell
PS path\to\kaburimake-checker-utils-ts> npm link
```

例: 使用

``` PowerShell
PS anywhere\you\want> kaburimake-checker-utils-ts --version
0.1.0
```

登録を解除したい場合は、シェル上のどこでもいいので、`npm unlink -g kaburimake-checker-utils-ts`と入力して決定してください。

例: 登録解除

``` PowerShell
PS anywhere\you\want> npm unlink -g kaburimake-checker-utils-ts
```

## コマンドとオプション

例:

``` PowerShell
PS path\to\kaburimake-checker-utils-ts> npm exec kaburimake-checker-utils-ts -- build -- --input C:/SSP/ghost
```

### `build`

ゴーストのフォルダがあるディレクトリ(例: `C:/SSP/ghost`)からjsonファイルを作成します。

- --output <path> : 出力するファイルを指定します。既定値: `./ghost_list.json`
- --input [dirs...] : 入力するディレクトリを指定します。複数指定可能。

### `append`

ゴーストのフォルダがあるディレクトリ(例: `C:/SSP/ghost`)からの情報をjsonファイルに追記します。

- --output <path> : 追記するファイルを指定します。既定値: `./ghost_list.json`
- --input [dirs...] : 入力するディレクトリを指定します。複数指定可能。

### `merge`

同じ形式のjsonファイルの情報をまとめ、1つのjsonファイルに出力します。

- --output <path> : 出力するファイルを指定します。既定値: `./ghost_list.json`
- --input [paths...] : 入力するファイルのパスを指定します。複数指定可能。

### `erase`

jsonファイルから指定した値を持つデータを削除します。

- --output <path> : 削除したいデータを持つjsonファイルを指定します。 既定値: `./ghost_list.json`
- --directory <directory> : 削除したいディレクトリ名を指定します。
- --sakuraname <name> : 削除したいsakuraNameを指定します。
- --keroname <name> : 削除したいkeroNameを指定します。

注意として、各々指定した値を持つ全てのデータが削除されます。

### `help`

ヘルプを表示します。

## 開発者向け: ビルド方法

``` shell
$ npm install
$ npm run build
```

## ライセンス

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">被り負けチェッカーTS</span> by <span property="cc:attributionName">月波 清火</span> is marked with <a href="http://creativecommons.org/publicdomain/zero/1.0?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC0 1.0 Universal<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1"></a></p>

あなたがこのプロジェクトに直接貢献した場合、同ライセンスの下、あなたの貢献したものがこのプロジェクトの一部としてパブリックドメインになることに同意したものとみなされます。

## 作成者

月波 清火 (tukinami seika)

[GitHub](https://github.com/tukinami)
