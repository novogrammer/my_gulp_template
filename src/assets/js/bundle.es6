import "./_mypolyfill.es6";

//expose libraries
window.EventEmitter=require("eventemitter3");
window.$=window.jQuery=require("jquery");
require("slick-carousel");
require("slick-carousel/slick/slick.css");
window.bootstrap=require("bootstrap");
require("bootstrap/dist/css/bootstrap.css");


