(function () {

    "use strict";

    /**
     * Clock is the base grade for all Clocks.
     */
    fluid.defaults("flock.clock", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        rate: 1, // Ticks per second.

        members: {
            time: 0,
            rate: "{that}.options.rate"
        },

        invokers: {
            tick: "fluid.identity()"
        },

        events: {
            onTick: null
        }
    });


    /**
     * Offline Clock
     *
     * An Offline Clock tracks time relatively
     * (i.e. without reference to a "real" source of time
     * such as the system clock).
     *
     * This clock can be driven manually (perhaps by an offline frame or
     * audio sample renderer) by invoking its tick() method.
     */
    fluid.defaults("flock.clock.offline", {
        gradeNames: ["flock.clock", "autoInit"],

        members: {
            tickDuration: {
                expander: {
                    funcName: "flock.clock.offline.calcTickDuration",
                    args: "{that}.options.rate"
                }
            }
        },

        invokers: {
            tick: {
                funcName: "flock.clock.offline.tick",
                args: ["{that}"]
            }
        }
    });

    flock.clock.offline.calcTickDuration = function (rate) {
        return 1.0 / rate;
    };

    flock.clock.offline.tick = function (that) {
        that.time += that.tickDuration;
        that.events.onTick.fire(that.time, that.rate);
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
        that.events.onTick.fire(that.time, that.rate);
    };

}());
