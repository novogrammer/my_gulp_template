// import { IS_DEBUG } from './_constants';

// import TypeSquareAdapter from "./_TypeSquareAdapter";

import EventEmitter from "eventemitter3";
import App from "./_App";

const { $ } = window;

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
