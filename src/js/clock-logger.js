(function () {

    "use strict";

    /**
     * Interval Logger logs the interval between ticks over time
     * into a typed array that can be used to analyse the realtime
     * performance of a clock instance (e.g. to determine definitively
     * if the clock is dropping frames).
     */
    fluid.defaults("flock.clock.logger", {
        gradeNames: ["flock.clock", "autoInit"],

        numTicksToLog: 60 * 60 * 20, // Twenty minutes at 60 fps by default.

        members: {
            tickCounter: 0,
            lastTickTime: null,
            interval: 0,
            intervalLog: "@expand:flock.clock.logger.initLog({that}.options.numTicksToLog)"
        },

        invokers: {
            log: "flock.clock.logger.log({that})"
        },

        listeners: {
            onTick: [
                "{that}.log()"
            ]
        }
    });

    flock.clock.logger.initLog = function (numTicksToLog) {
        return new Float32Array(numTicksToLog);
    };

    // TODO: This would be much better expressed as a
    // set of separate model listeners.
    flock.clock.logger.log = function (that) {
        if (that.lastTickTime === null) {
            that.lastTickTime = that.time;
            return;
        }

        that.tickCounter++;
        that.interval = that.time - that.lastTickTime;

        if (that.tickCounter < that.options.numTicksToLog) {
            that.intervalLog[that.tickCounter] = that.interval;
        }
    };
}());
