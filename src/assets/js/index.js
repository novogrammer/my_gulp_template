// import { IS_DEBUG } from './_constants';

import App from "./_App";
// import TypeSquareAdapter from "./_TypeSquareAdapter";
const { $, EventEmitter } = window;

// const promiseWindowLoad = new Promise((resolve) => {
//   $(window).on('load', () => resolve());
// });

$(() => {
  const emitter = new EventEmitter();
  const promises = [];
  // promises.push(promiseWindowLoad);
  // promises.push(TypeSquareAdapter.load());
  promises.push(App.load());
  Promise.all(promises).then(() => {
    window.app = new App(emitter);
  });
});
