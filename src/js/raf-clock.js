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
            requestID: null
        },

        invokers: {
            start: {
                funcName: "flock.clock.raf.requestNextTick",
                args: ["{that}"]
            },

            tick: {
                funcName: "flock.clock.raf.tick",
                args: ["{that}"]
            },

            stop: {
                funcName: "flock.clock.raf.stop",
                args: ["{that}"]
            }
        }
    });

    flock.clock.raf.requestNextTick = function (that) {
        that.requestID = requestAnimationFrame(that.tick);
    };

    flock.clock.raf.tick = function (that) {
        flock.clock.raf.requestNextTick(that);

        var now = performance.now();
        that.time = now;
        that.events.onTick.fire(now, that.rate);
    };

    flock.clock.raf.stop = function (that) {
        cancelAnimationFrame(that.requestID);
    };

}());
