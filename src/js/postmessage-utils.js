/*
 * Bergson postMessage Components
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

    // A function that returns "self",
    // in order to prevent Infusion from chewing it.
    // TODO: Will a mergePolicy address this?
    berg.getGlobalSelf = function () {
        return self;
    };

    fluid.defaults("berg.postMessageSender", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        members: {
            messageTarget: "@expand:berg.getGlobalSelf()"
        },

        invokers: {
            postMessage: "berg.postMessageSender.postMessage({arguments}.0, {arguments}.1, {that}.messageTarget)"
        }
    });

    berg.postMessageSender.postMessage = function (type, args, messageTarget) {
        if (typeof type !== "string") {
            throw new Error("Can't post a message without a message type.");
        }

        var message = {
            type: type,
            args: args
        };

        messageTarget.postMessage(message);
    };


    fluid.defaults("berg.postMessageListener", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        members: {
            messageSource: "@expand:berg.getGlobalSelf()"
        },

        events: {
            onError: null
        },

        listeners: {
            onCreate: [
                "berg.postMessageListener.bind({that})"
            ],

            onError: [
                {
                    namespace: "failOnError",
                    funcName: "fluid.fail"
                }
            ]
        }
    });

    berg.postMessageListener.bind = function (that) {
        that.messageSource.addEventListener("message", function (e) {
            var msg = e.data;

            if (!msg.type) {
                that.events.onError.fire("Received a remote message without a type. " +
                    fluid.prettyPrintJSON(msg));
            }

            var invoker = that[msg.type];
            if (!that.options.invokers[msg.type] || !invoker) {
                that.events.onError.fire("Received a message of type " + msg.type +
                    ", which did not resolve to a component invoker. Invokers: " +
                    fluid.prettyPrintJSON(that.options.invokers));
            }

            var args = fluid.makeArray(msg.args);
            invoker.apply(null, args);
        }, false);
    };

}());
