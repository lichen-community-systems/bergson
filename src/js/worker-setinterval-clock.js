/*
* Bergson Web Worker-based setInterval Clock
* http://github.com/colinbdclark/bergson
*
* Copyright 2015, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/
(function () {
    "use strict";

    // TODO: Cut and pasted from the Flocking Scheduler.
    berg.worker = function (code) {
        var type = typeof code,
            url,
            blob;

        if (type === "function") {
            code = "(" + code.toString() + ")();";
        } else if (type !== "string") {
            throw new Error("A berg.worker must be initialized with a String or a Function.");
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

    fluid.defaults("berg.clock.workerSetInterval", {
        gradeNames: ["berg.clock.realtime", "autoInit"],

        members: {
            worker: '@expand:berg.clock.workerSetInterval.initWorker()'
        },

        invokers: {
            start: {
                funcName: "berg.clock.workerSetInterval.post",
                args: [
                    "{that}.worker",
                    {
                        msg: "start",
                        value: {
                            rate: "{that}.options.rate"
                        }
                    }
                ]
            },

            stop: "berg.clock.workerSetInterval.stop({that})"
        },

        listeners: {
            onCreate: [
                "berg.clock.workerSetInterval.listen({that})"
            ]
        }
    });

    berg.clock.workerSetInterval.initWorker = function () {
        return berg.worker(berg.clock.workerSetInterval.workerImpl);
    };

    berg.clock.workerSetInterval.listen = function (that) {
        that.worker.addEventListener("message", function (e) {
            if (e.data.msg === "tick") {
                that.tick(performance.now());
            }
        }, false);
    };

    berg.clock.workerSetInterval.post = function (worker, msg) {
        worker.postMessage(msg);
    };

    berg.clock.workerSetInterval.stop = function (that) {
        berg.clock.workerSetInterval.post(that.worker, {
            msg: "stop"
        });

        that.worker.terminate();
    };

    // Note: This function is intended to be invoked as
    // an berg.worker only.
    // TODO: This is pretty well copied from the Flocking
    // Scheduler.
    berg.clock.workerSetInterval.workerImpl = function () {
        "use strict"; // jshint ignore:line

        var berg = {};

        berg.workerClock = function (options) {
            var that = {
                options: options || {},
                intervalID: null
            };

            that.start = function () {
                that.intervalID = setInterval(that.tick, 1000 / that.options.rate);
            };

            that.tick = function () {
                self.postMessage({
                    msg: "tick"
                });
            };

            that.stop = function () {
                clearInterval(that.intervalID);
            };

            return that;
        };

        self.addEventListener("message", function (e) {
            if (e.data.msg === "start") {
                berg.clock = berg.workerClock({
                    rate: e.data.value
                });
                berg.clock.start();
            } else if (e.data.msg === "stop") {
                if (berg.clock) {
                    berg.clock.stop();
                }
                self.close();
            }
        }, false);
    };
}());
