/*
 * Bergson Worker-based Scheduler
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * A Scheduler that runs in a Web Worker or other environment
     * where it delegates callback invocation to an out-of-thread proxy
     * using postMessage().
     */
    fluid.defaults("berg.scheduler.postMessage", {
        gradeNames: [
            "berg.postMessageListener",
            "berg.postMessageSender",
            "berg.scheduler",
            "autoInit"
        ],

        invokers: {
            invokeCallback: {
                funcName: "berg.scheduler.postMessage.post",
                args: ["invokeCallback", ["{arguments}.0", "{arguments}.1"], "{that}"]
            }
        }
    });

    // TODO: Apparent Infusion options merging bug.
    // Try with compact invoker syntax or "func",
    // and it will fail due to creating a merged invoker record
    // containing both "funcName" and "func".
    berg.scheduler.postMessage.post = function (type, args, that) {
        that.postMessage(type, args);
    };

    /**
     * A Proxy Scheduler that communicates with  a
     * Web Worker-based PostMessageScheduler via postMessage.
     *
     * The Proxy Scheduler is responsible for maintaining a map
     * of functions by id so that they can be invoked in the current thread.
     */
    fluid.defaults("berg.scheduler.workerProxy", {
        gradeNames: [
            "berg.scheduler",
            "berg.postMessageListener",
            "berg.postMessageSender",
            "autoInit"
        ],

        scriptPath: "../../dist/bergson-all-worker.js",

        remoteSchedulerOptions: {
            components: {
                clock: {
                    type: "berg.clock.setInterval",
                    options: {
                        freq: 1 / 100 // Tick every 10 ms by default.
                    }
                }
            }
        },

        members: {
            eventSpecMap: {},
            worker: "@expand:berg.scheduler.workerProxy.createWorker({that}.options.scriptPath)",
            messageTarget: "{that}.worker",
            messageSource: "{that}.worker"
        },

        components: {
            clock: {
                type: "berg.clock" // The real clock is in the other universe.
            }
        },

        invokers: {
            start: "{that}.postMessage(start)",
            stop: "{that}.postMessage(stop)",
            tick: "fluid.identity()",
            invokeCallback: "berg.scheduler.workerProxy.invokeCallback({arguments}.0, {arguments}.1, {that})",
            scheduleEvent: "berg.scheduler.workerProxy.scheduleEvent({arguments}.0, {that})",
            clear: "{that}.postMessage(clear, {arguments}.0)",
            clearAll: "{that}.postMessage(clearAll)",
            setTimeScale: "{that}.postMessage(setTimeScale, {arguments}.0)"
        },

        listeners: {
            onCreate: [
                {
                    func: "{that}.postMessage",
                    args: ["create", ["berg.scheduler.postMessage", "{that}.options.remoteSchedulerOptions"]]
                }
            ],

            onDestroy: [
                {
                    this: "{that}.worker",
                    method: "terminate"
                }
            ]
        }
    });

    berg.scheduler.workerProxy.createWorker = function (scriptPath) {
        return new Worker(scriptPath);
    };

    berg.scheduler.workerProxy.invokeCallback = function (now, scoreEventSpecFromWorker, that) {
        var localEventSpec = that.eventSpecMap[scoreEventSpecFromWorker.id],
            callback = localEventSpec.callback;

        if (typeof callback === "function") {
            callback(now, scoreEventSpecFromWorker);
        } else {
            that.events.onError.fire("A callback function was not found for score event: " +
                fluid.prettyPrintJSON(localEventSpec));
        }
    };

    berg.scheduler.workerProxy.makeTransferrableCopy = function (eventSpec) {
        var toTransfer = fluid.copy(eventSpec);
        delete toTransfer.callback; // Functions can't survive the journey to the other universe.

        return toTransfer;
    };

    berg.scheduler.workerProxy.scheduleEvent = function (eventSpec, that) {
        berg.scheduler.expandEventSpec(eventSpec);
        that.eventSpecMap[eventSpec.id] = eventSpec;

        var toTransfer = berg.scheduler.workerProxy.makeTransferrableCopy(eventSpec);
        that.postMessage("scheduleEvent", toTransfer);
    };

}());
