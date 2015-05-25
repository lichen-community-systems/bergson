(function () {

    "use strict";

    fluid.defaults("flock.clock.setInterval", {
        gradeNames: ["flock.clock.realtime", "autoInit"],

        members: {
            intervalID: null
        },

        invokers: {
            start: {
                funcName: "flock.clock.setInterval.start",
                args: ["{that}"]
            },

            stop: {
                funcName: "flock.clock.setInterval.stop",
                args: ["{that}"]
            }
        }
    });

    flock.clock.setInterval.start = function (that) {
        that.intervalID = setInterval(that.tick, 1000 / that.options.rate);
    };

    flock.clock.setInterval.stop = function (that) {
        clearInterval(that.intervalID);
    };
}());
