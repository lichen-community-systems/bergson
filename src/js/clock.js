(function () {

    "use strict";

    /**
     * Clock is the base grade for all Clocks.
     */
    fluid.defaults("flock.clock", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        rate: 1, // Ticks per second.

        members: {
            time: 0
        },

        invokers: {
            tick: "fluid.identity()"
        },

        events: {
            onTick: null
        }
    });


    /**
     * Relative Clock
     *
     * A Relative Clock tracks time relatively (i.e. without reference
     * to "real" time).
     *
     * This clock can be driven manually (perhaps by an offline frame or
     * audio sample renderer) by invoking its tick() method.
     */
    fluid.defaults("flock.clock.relative", {
        gradeNames: ["flock.clock", "autoInit"],

        members: {
            tickDuration: {
                expander: {
                    funcName: "flock.clock.relative.calcTickDuration",
                    args: "{that}.options.rate"
                }
            }
        },

        invokers: {
            tick: {
                funcName: "flock.clock.relative.tick",
                args: ["{that}"]
            }
        }
    });

    flock.clock.relative.calcTickDuration = function (rate) {
        return 1.0 / rate;
    };

    flock.clock.relative.tick = function (that) {
        that.time += that.tickDuration;
        that.events.onTick.fire(that.time);
    };


    /**
     * A Realtime Clock tracks time based on actual system time
     * (i.e. performance.now)
     */
    fluid.defaults("flock.clock.realtime", {
        gradeNames: ["flock.clock", "autoInit"],

        members: {
            time: {
                expander: {
                    "this": performance,
                    method: "now"
                }
            }
        },

        invokers: {
            tick: {
                funcName: "flock.clock.realtime.tick",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    flock.clock.realtime.tick = function (that) {
        that.time = performance.now();
        that.events.onTick.fire(that.time);
    };

}());
