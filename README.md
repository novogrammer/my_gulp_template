my_gulp_template
=====================

# 自分用のgulpひな形

ご自由にどうぞ。

## 前提
* Node.js 18.x
    * `.node-version`が使えるnodenvなどを推奨


## 導入
```
$ npm install
```

## 実行
```
$ npx gulp
```
または
```
$ npm start
```

## コーディングスタイルを揃える
```
$ npm run fix
```


# Dockerを使う場合

## Dockerイメージの作成
```
$ docker-compose build
```
## Dockerコンテナの開始
npm run startを呼びます
```
$ docker-compose up -d
```
## Dockerコンテナの終了
```
$ docker-compose down
```

