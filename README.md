my_gulp_template
=====================

# 自分用のgulpひな形

ご自由にどうぞ。

## 前提
* Node.js 20.x
    * `.node-version`が使えるnodenvなどを推奨


## 導入
```bash
$ npm install
```

## 実行
```bash
$ npx gulp
```
または
```bash
$ npm start
```

## コーディングスタイルを揃える
```bash
$ npm run fix
```

## HTMLのバリデート

```bash
$ npm run html-validate
```

# Dockerを使う場合

## Dockerイメージの作成
```bash
$ docker-compose build
```
## Dockerコンテナの開始
npm run startを呼びます
```bash
$ docker-compose up -d
```
## Dockerコンテナの終了
```bash
$ docker-compose down
```

