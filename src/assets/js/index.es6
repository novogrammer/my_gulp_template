import {
  IS_DEBUG,
} from './_constants.es6';

import App from './_App.es6';
// import TypeSquareAdapter from "./_TypeSquareAdapter.es6";
const {
  $,
  EventEmitter,
} = window;

const promiseWindowLoad = new Promise((resolve) => {
  $(window).on('load', () => resolve());
});

$(() => {
  const emitter = new EventEmitter();
  emitter.on('begin intro', () => {
    if (IS_DEBUG) {
      console.log('begin intro');
    }
    $('#LoadingMask').fadeOut();
  });
  emitter.on('end intro', () => {
    if (IS_DEBUG) {
      console.log('end intro');
    }
    $('#IntroMask').fadeOut();
    $('#Main').css({
      position: 'relative', width: 'auto', height: 'auto', overflow: 'visible',
    });
  });
  const promises = [];
  promises.push(promiseWindowLoad);
  // promises.push(TypeSquareAdapter.load());
  promises.push(App.load());
  Promise.all(promises).then(() => {
    window.app = new App(emitter);
  });
});
