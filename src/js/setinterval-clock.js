(function () {

    "use strict";

    fluid.defaults("flock.clock.mainThreadSetInterval", {
        gradeNames: ["flock.clock.realtime", "autoInit"],

        members: {
            intervalID: null
        },

        invokers: {
            start: {
                funcName: "flock.clock.mainThreadSetInterval.start",
                args: ["{that}"]
            },

            stop: {
                funcName: "flock.clock.mainThreadSetInterval.stop",
                args: ["{that}"]
            }
        }
    });

    flock.clock.mainThreadSetInterval.start = function (that) {
        that.intervalID = setInterval(that.tick, 1000 / that.options.rate);
    };

    flock.clock.mainThreadSetInterval.stop = function (that) {
        clearInterval(that.intervalID);
    };
}());
