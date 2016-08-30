/*
 * Bergson Node.js
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

/* eslint-env node */

"use strict";

var fluid = require("infusion"),
    berg = fluid.registerNamespace("berg");

require("./src/js/clock.js");
require("./src/js/setinterval-clock.js");
require("./src/js/priority-queue.js");
require("./src/js/clock-logger.js");
require("./src/js/scheduler.js");

module.exports = berg;
