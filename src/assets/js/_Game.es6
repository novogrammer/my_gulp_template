import {
  FPS,
  IS_DEBUG,
} from './_constants.es6';

const {
  Stats,
  animate,
  $,
} = window;

export default class Game {
  constructor(emitter) {
    this.emitter = emitter;
    this.setupIntro();
    this.setupStats();
    this.setupEvents();
  }

  setupIntro() {
    this.emitter.emit('begin intro');
    setTimeout(() => {
      this.emitter.emit('end intro');
    }, 2 * 1000);
  }

  setupStats() {
    this.stats = new Stats();
    const $dom = $(this.stats.dom);
    $dom.attr('id', 'Stats');
    $('body').append($dom);
    $('#Stats').css({ left: 'auto', right: 0 });
    $('#Stats').toggle(IS_DEBUG);
  }

  setupEvents() {
    $(window).on('resize', () => {
      this.onResize();
    });
    this.onResize();
    this.animation = animate(() => {
      this.stats.begin();
      this.onTick();
      this.stats.end();
    }, FPS);
  }

  // eslint-disable-next-line class-methods-use-this
  onResize() {

  }

  // eslint-disable-next-line class-methods-use-this
  onTick() {

  }

  static load() {
    const promises = [];
    return Promise.all(promises);
  }
}
