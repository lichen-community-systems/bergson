/*
* Bergson setInterval Clock
* http://github.com/colinbdclark/bergson
*
* Copyright 2015, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/
(function () {
    "use strict";

    fluid.defaults("berg.clock.setInterval", {
        gradeNames: ["berg.clock.realtime", "autoInit"],

        members: {
            intervalID: null
        },

        invokers: {
            start: {
                funcName: "berg.clock.setInterval.start",
                args: ["{that}"]
            },

            stop: {
                funcName: "berg.clock.setInterval.stop",
                args: ["{that}"]
            }
        }
    });

    berg.clock.setInterval.start = function (that) {
        that.intervalID = setInterval(that.tick, 1000 / that.options.rate);
    };

    berg.clock.setInterval.stop = function (that) {
        clearInterval(that.intervalID);
    };
}());
