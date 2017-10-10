import "./_mypolyfill.es6";

import EventEmitter from "eventemitter3";
import $ from "jquery";

//expose libraries
window.EventEmitter=EventEmitter;
window.$=$;
