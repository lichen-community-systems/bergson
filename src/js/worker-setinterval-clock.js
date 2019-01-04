/*
 * Bergson Web Worker-based setInterval Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, self*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

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
        gradeNames: [
            "berg.clock.realtime",
            "berg.postMessageListener",
            "berg.postMessageSender"
        ],

        freq: 10,

        members: {
            worker: "@expand:berg.clock.workerSetInterval.createWorker()",
            messageTarget: "{that}.worker",
            messageSource: "{that}.worker"
        },

        listeners: {
            "onStart.postStart": {
                priority: "after:updateState",
                func: "{that}.postMessage",
                args: [
                    "start",
                    [
                        {
                            freq: "{that}.options.freq"
                        }
                    ]
                ]
            },

            "onStop.postStop": {
                priority: "after:updateState",
                func: "{that}.postMessage",
                args: ["stop"]
            },

            "onDestroy.terminateWorker": {
                this: "{that}.worker",
                method: "terminate"
            }
        }
    });

    berg.clock.workerSetInterval.createWorker = function () {
        return berg.worker(berg.clock.workerSetInterval.workerImpl);
    };


    // Note: This function is intended to be invoked as
    // an berg.worker only.
    berg.clock.workerSetInterval.workerImpl = function () {
        "use strict"; // eslint-disable-line

        var berg = {};

        berg.workerClock = function (options) {
            var that = {
                options: options || {},
                intervalID: null
            };

            that.start = function () {
                that.intervalID = setInterval(that.tick, 1000 / that.options.freq);
            };

            that.tick = function () {
                self.postMessage({
                    type: "tick"
                });
            };

            that.stop = function () {
                clearInterval(that.intervalID);
            };

            return that;
        };

        self.addEventListener("message", function (e) {
            if (e.data.type === "start") {
                berg.clock = berg.workerClock({
                    freq: e.data.args[0].freq
                });
                berg.clock.start();
            } else if (e.data.type === "stop") {
                if (berg.clock) {
                    berg.clock.stop();
                }
            }
        }, false);
    };
})();
