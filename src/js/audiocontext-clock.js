/*
 * Bergson AudioContext Clock
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
     * AudioContext Clock
     *
     * An AudioContext Clock takes its real time value
     * from a WebAudio API AudioContext instance.
     *
     * An AudioContext instance will created if one is not
     * provided as a member option when instaniating this clock.
     *
     * This clock needs to be ticked manually; you will typically
     * invoke its tick() method in a custom ScriptProcessorNode.onaudioprocess
     * implementation.
     */
    fluid.defaults("berg.clock.audioContext", {
        gradeNames: ["berg.clock.realtime"],

        blockSize: 256,

        mergePolicy: {
            "members.context": "noexpand"
        },

        members: {
            context: "@expand:berg.clock.audioContext.createContext()",
            freq: "@expand:berg.clock.audioContext.calcFreq({that}.context, {that}.options.blockSize)",
            time: "@expand:berg.clock.audioContext.now({that}.context)"
        },

        invokers: {
            tick: {
                funcName: "berg.clock.audioContext.tick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.audioContext.createContext = function () {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    };

    berg.clock.audioContext.calcFreq = function (context, blockSize) {
        return context.sampleRate / blockSize;
    };

    berg.clock.audioContext.now = function (context) {
        return context.currentTime;
    };

    berg.clock.audioContext.tick = function (that) {
        that.time = that.context.currentTime;
        that.events.onTick.fire(that.time, that.freq);
    };

    /**
     * An AutoAudioContext Clock automatically creates
     * and configures a ScriptProcessorNode to drive the clock.
     */
    fluid.defaults("berg.clock.autoAudioContext", {
        gradeNames: ["berg.clock.audioContext"],

        mergePolicy: {
            "members.scriptNode": "noexpand"
        },

        members: {
            scriptNode: {
                expander: {
                    funcName: "berg.clock.autoAudioContext.createScriptNode",
                    args: ["{that}.context", "{that}.options.blockSize"]
                }
            }
        },

        listeners: {
            "onStart.startAudioContext": {
                priority: "after:updateState",
                funcName: "berg.clock.autoAudioContext.start",
                args: ["{that}"]
            },

            "onStop.stopAudioContext": {
                priority: "after:updateState",
                funcName: "berg.clock.autoAudioContext.stop",
                args: ["{that}"]
            }
        }
    });

    berg.clock.autoAudioContext.createScriptNode = function (context,
        blockSize) {
        var scriptNode = context.createScriptProcessor(blockSize, 1, 1);
        return scriptNode;
    };

    berg.clock.autoAudioContext.start = function (that) {
        that.scriptNode.connect(that.context.destination);
        that.scriptNode.onaudioprocess = that.tick;
        that.context.resume();
    };

    berg.clock.autoAudioContext.stop = function (that) {
        try {
            that.scriptNode.disconnect(that.context.destination);
        } catch (e) {
            // Only swallow the error if was thrown because
            // the script node wasn't connected,
            // which can occur if stop() is called before start().
            if (e.name !== "InvalidAccessError")  {
                throw e;
            }
        }

        that.scriptNode.onaudioprocess = undefined;
        that.context.suspend();
    };
})();
