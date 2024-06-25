'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};



//////////////////
// WEBPACK FOOTER
// ./lib/cancel/isCancel.js
// module id = 20
// module chunks = 0