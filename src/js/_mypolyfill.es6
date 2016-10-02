//for IE10
import "babel-polyfill";
//and
//plugins: [['transform-es2015-classes', {loose: true}]],
//see also https://phabricator.babeljs.io/T3041


window.console = window.console || {
  log: function () {}
};

