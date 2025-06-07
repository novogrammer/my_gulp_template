my_gulp_template
=====================

# 自分用のgulpひな形

[![CI](https://github.com/novogrammer/my_gulp_template/actions/workflows/ci.yaml/badge.svg)](https://github.com/novogrammer/my_gulp_template/actions/workflows/ci.yaml)

ご自由にどうぞ。

## 前提
* Node.js 22.x
    * `.node-version`が使えるnodenvなどを推奨


## 導入
```bash
npm install
```

## 実行
```bash
npx gulp
```
または
```bash
npm start
```

## コーディングスタイルを揃える
```bash
npm run fix
```

## HTMLのバリデート

```bash
npm run html-validate
```

## プロジェクト構成

### 全体構造
* `.github/`
* `src/`
    * `'src/assets/css/**/[!_]*.scss'`
    * `'src/assets/js/**/[!_]*.{js,ts}'`
    * `src/assets/img/`
    * `src/assets/lib/`
    * `'src/**/[!_]*.pug'`
* `dist/`
* `raw_contents/`
* `gulpfile.mjs`
* `package.json`
* `Dockerfile`
* `docker-compose.yml`
* `test/`

### `.github/`
GitHub Actions のワークフロー（CIなど）を格納します。

### `src/`
プロジェクトのソースコードを格納します。処理されたファイルは `dist/` ディレクトリに出力されます。このプロジェクトでは、一般的に `_` (アンダースコア) で始まらないファイルが、PugテンプレートやJavaScript/TypeScriptファイルの主要なエントリーポイントとして扱われます。

#### `'src/assets/css/**/[!_]*.scss'`
SCSSファイルが格納されます。これらはCSSにコンパイルされ、自動的にベンダープレフィックスが付与された後、`dist/assets/css/`に出力されます。

#### `'src/assets/js/**/[!_]*.{js,ts}'`
JavaScriptおよびTypeScriptファイルが格納されます（`_`で始まるファイルを除く）。Rollupによってバンドル処理（TypeScriptコンパイル、モジュール解決、本番ビルド時の難読化など）が行われ、`dist/assets/js/`に出力されます。

#### `src/assets/img/`
画像ファイルが格納されます。これらのファイルは`dist/assets/img/`にコピーされると同時に、JPGおよびPNGファイルはWebP形式にも変換され、同じく`dist/assets/img/`に出力されます。

#### `src/assets/lib/`
その他のライブラリファイルが格納されます。これらの内容は`dist/assets/lib/`にコピーされます。

#### `'src/**/[!_]*.pug'`
Pugテンプレートファイルが格納されます。これらはHTMLにコンパイルされ、整形された後、`dist/`ディレクトリに出力されます。`src/index.pug`はこの一つです。

### `dist/`
全てのビルド成果物（コンパイルされたCSS、JavaScript、HTML、処理済み画像など）が格納される出力ディレクトリです。

### `raw_contents/`
ビルド処理を必要としない静的ファイル（例: faviconや検証用のHTMLファイルなど）を配置するためのディレクトリです。開発サーバー実行時（`npm start` または `npx gulp`）、このディレクトリの内容は `dist/` ディレクトリの内容と合わせてルートパスから提供されます。

### `gulpfile.mjs`
Gulp（JavaScriptタスクランナー）の設定ファイルです。

### `package.json`
プロジェクトの依存関係やスクリプトを定義します。

### `Dockerfile`, `docker-compose.yml`
Dockerコンテナ化のためのファイルです。

### `test/`
テストファイルを格納します。

# Dockerを使う場合

## Dockerイメージの作成
```bash
docker compose build
```
## Dockerコンテナの開始
npm run startを呼びます
```bash
docker compose up -d
```
## Dockerコンテナの終了
```bash
docker compose down
```

