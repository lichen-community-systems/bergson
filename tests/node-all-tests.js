/*
 * Bergson All Tests Runner
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

/* eslint-env node */
"use strict";

require("../index.js");

var testIncludes = [
    "./js/utils/clock-test-utilities.js",
    "./js/utils/clock-tester.js",
    "./js/utils/offline-tester.js",
    "./js/utils/realtime-tester.js",
    "./js/utils/scheduler-test-utilities.js",

    "./js/offline-clock-tests.js",
    "./js/realtime-clock-tests.js",
    "./js/setinterval-clock-tests.js",
    "./js/clock-logger-tests.js",
    "./js/priority-queue-tests.js",
    "./js/scheduler-tests.js"
];

testIncludes.forEach(function (path) {
    require(path);
});
