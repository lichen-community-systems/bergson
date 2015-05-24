(function () {

    "use strict";

    // TODO: Cut and pasted from the Flocking Scheduler.
    flock.worker = function (code) {
        var type = typeof code,
            url,
            blob;

        if (type === "function") {
            code = "(" + code.toString() + ")();";
        } else if (type !== "string") {
            throw new Error("An flock.worker must be initialized with a String or a Function.");
        }

        if (window.Blob) {
            blob = new Blob([code], {
                type: "text/javascript"
            });
            url = (window.URL || window.webkitURL).createObjectURL(blob);
        } else {
            url = "data:text/javascript;base64," + window.btoa(code);
        }
        return new Worker(url);
    };

    fluid.defaults("flock.clock.workerSetInterval", {
        gradeNames: ["flock.clock.realtime", "autoInit"],

        members: {
            worker: '@expand:flock.clock.workerSetInterval.initWorker()'
        },

        invokers: {
            start: {
                funcName: "flock.clock.workerSetInterval.post",
                args: [{
                    msg: "start",
                    value: {
                        rate: "{that}.options.rate"
                    }
                }]
            },

            stop: {
                funcName: "flock.clock.workerSetInterval.post",
                args: [{
                    msg: "stop"
                }]
            }
        },

        onCreate: [
            "flock.clock.workerSetInterval.listen({that})"
        ]
    });

    flock.clock.workerSetInterval.initWorker = function () {
        return flock.worker(flock.clock.workerSetInterval.workerImpl);
    };

    flock.clock.workerSetInterval.listen = function (that) {
        that.worker.addListener("message", function (e) {
            if (e.data.msg === "tick") {
                that.tick(e.data.value);
            }
        });
    };

    flock.clock.workerSetInterval.post = function (msg) {
        postMessage(msg);
    };

    // Note: This function is intended to be invoked as
    // an flock.worker only.
    // TODO: This is pretty well copied from the Flocking
    // Scheduler.
    flock.clock.workerSetInterval.workerImpl = function () {
        "use strict"; // jshint ignore:line

        var flock = {};

        flock.workerClock = function (options) {
            var that = {
                options: options || {};
            };

            that.start = function () {
                that.intervalID = setInterval(that.tick, 1000 / that.options.rate);
            };

            that.tick = function () {
                self.postMessage({
                    msg: "tick",
                    value: performance.now()
                });
            };

            that.stop = function () {
                clearInterval(that.intervalID);
            };

            return that;
        };

        self.addEventListener("message", function (e) {
            if (e.data.msg === "start") {
                flock.clock = flock.workerClock(e.data.value);
                flock.clock.start();
            } else if (e.data.msg === "stop") {
                if (flock.clock) {
                    flock.clock.stop();
                }

                self.close();
            }
        });
    };
}());
