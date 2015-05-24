(function () {

    "use strict";

    /**
     * The RAF Clock is a realtime clock driven by
     * window.requestAnimationFrame()
     */
    fluid.defaults("flock.clock.raf", {
        gradeNames: ["flock.clock.realtime", "autoInit"],

        rate: 60, // This should be overridden by the user
                  // to match the refresh rate of their display.

        members: {
            raf: window.requestAnimationFrame || window.webkitRequestAnimationFrame,
            requestID: null
        },

        invokers: {
            start: {
                funcName: "flock.clock.raf.requestNextTick",
                args: ["{that}"]
            },

            tick: {
                funcName: "flock.clock.raf.tick",
                args: ["{that}", "{arguments}.0"]
            },

            stop: {
                funcName: "flock.clock.raf.stop",
                args: ["{that}"]
            }
        }
    });

    flock.clock.raf.requestNextTick = function (that) {
        that.requestID = that.raf(that.tick);
    };

    flock.clock.raf.tick = function (that, now) {
        that.time = now;
        that.events.onTick.fire(now);
        flock.clock.raf.requestNextTick(that);
    };

    flock.clock.raf.stop = function (that) {
        window.cancelAnimationFrame(that.requestID);
    };

}());
