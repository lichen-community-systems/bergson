/*
 * Bergson Worker-based Scheduler
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    fluid.defaults("berg.postMessageSender", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        members: {
            messageTarget: self
        },

        invokers: {
            postMessage: "berg.postMessageSender.postMessage({arguments}, {that}.messageTarget)"
        }
    });

    berg.postMessageSender.postMessage = function (args, messageTarget) {
        var msgType = args[0];
        if (typeof msgType !== "string") {
            throw new Error("Can't post a message without a message type.");
        }

        var message = {
            type: msgType,
            args: args.slice(1)
        };

        messageTarget.postMessage(message);
    };


    fluid.defaults("berg.postMessageListener", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        members: {
            messageSource: self
        },

        events: {
            onError: null
        },

        listeners: {
            onCreate: [
                "berg.postMessageListener.bind({that)"
            ],

            onError: [
                {
                    namespace: "failOnError",
                    funcName: "fluid.fail"
                }
            ]
        }
    });

    berg.postMessageListener.bind = function (messageSource, events) {
        messageSource.addEventListener("message", function (e) {
            var msg = e.data;

            if (!msg.type) {
                events.onError.fire("Received a remote message without a type. " +
                    fluid.prettyPrintJSON(msg));
            }

            var invoker = that[msg.type];
            if (!that.options.invokers[msgType] || !invoker) {
                events.onError.fire("Received a message of type " + msg.type +
                    ", which did not resolve to a component invoker. Invokers: " +
                    fluid.prettyPrintJSON(that.options.invokers));
            }

            invoker.apply(null, msg.args);
        }, false);
    };


    /**
     * A Scheduler that runs in a Web Worker.
     */
    fluid.defaults("berg.scheduler.worker", {
        gradeNames: ["berg.scheduler", "berg.postMessageSender", "autoInit"],

        invokers: {
            invokeCallback: "{that}.postMessage(invokeCallback, {arguments}.0, {arguments}.1)"
        }
    });

    /**
     * A Proxy Scheduler that delegates to a
     * Web Worker-based Scheduler, communicating with it
     * via postMessage().
     *
     * The Proxy Scheduler is responsible for maintaining a map
     * of functions by id so that they can be invoked in the current thread.
     */
    fluid.defaults("berg.scheduler.proxy", {
        gradeNames: ["berg.scheduler", "berg.postMessageListener", "berg.postMessageSender", "autoInit"],

        members: {
            callbackMap: {},
            worker: "@expand:berg.scheduler.proxy.createWorker()",
            messageTarget: "{that}.worker",
            messageSource: "{that}.worker"
        },

        invokers: {
            invokeCallback: "berg.scheduler.proxy.invokeCallback({arguments}.0, {arguments}.1, {that})",
            scheduleEvent: "berg.scheduler.proxy.scheduleEvent({arguments}.0, {that})",
            clear: "{that}.postMessage(clear, {arguments}.0)",
            clearAll: "{that}.postMessage(clearAll)",
            setTimeScale: "{that}.postMessage(setTimeScale, {arguments}.0)"
        },

        listeners: {
            onDestroy: [
                "{that}.postMessage(destroy)",
                "{worker}.close()"
            ]
        }
    });

    berg.scheduler.proxy.invokeCallback = function (scoreEvent, now, that) {
        var callback = that.callbackMap[scoreEvent.id];

        if (typeof callback === "function") {
            callback(now, scoreEvent);
        } else {
            that.events.onError.fire("A callback function was not found for score event: " +
                fluid.prettyPrintJSON(scoreEvent));
        }
    };

    berg.scheduler.proxy.scheduleEvent = function (eventSpec, that) {
        if (!eventSpec.id) {
            eventSpec.id = fluid.allocateGuid();
            that.callbackMap[eventSpec.id] = eventSpec.callback;
        }
        delete eventSpec.callback;

        that.postMessage("scheduleEvent", eventSpec);
    };

}());
