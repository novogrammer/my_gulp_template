import animate from "animate";
import Stats from "stats.js";
import { FPS, IS_DEBUG } from "./_constants";

export default class App {
  constructor(emitter) {
    this.emitter = emitter;
    this.previousSize = null;
    this.previousScrollTop = null;
    this.setupStats();
    this.setupEvents();
  }

  setupStats() {
    this.stats = new Stats();
    this.stats.dom.id = "Stats";
    document.body.append(this.stats.dom);
    this.stats.dom.style.left = "auto";
    this.stats.dom.style.right = "0";
    if (!IS_DEBUG) {
      this.stats.dom.style.display = "none";
    }
  }

  setupEvents() {
    const { emitter } = this;
    emitter.on("resize", this.onResize, this);
    this.onResize();
    emitter.on("scroll", this.onScroll, this);
    emitter.on("tick", this.onTick, this);

    this.animation = animate(() => {
      this.stats.begin();
      this.checkEvents();
      emitter.emit("tick");
      this.stats.end();
    }, FPS);
  }

  // eslint-disable-next-line class-methods-use-this
  getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  checkResize() {
    const { emitter } = this;
    const size = this.getSize();
    if (
      this.previousSize != null &&
      this.previousSize.width === size.width &&
      this.previousSize.height === size.height
    ) {
      return;
    }
    this.previousSize = size;
    emitter.emit("resize");
  }

  checkScroll() {
    const { emitter } = this;
    const scrollTop = window.scrollY;
    if (
      this.previousScrollTop != null &&
      this.previousScrollTop === scrollTop
    ) {
      return;
    }
    this.previousScrollTop = scrollTop;
    emitter.emit("scroll");
  }

  checkEvents() {
    this.checkResize();
    this.checkScroll();
  }

  // eslint-disable-next-line
  onScroll() {}

  // eslint-disable-next-line
  onResize() {}

  // eslint-disable-next-line
  onTick() {}

  static load() {
    const promises = [];
    return Promise.all(promises);
  }
}
