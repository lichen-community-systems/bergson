/*
 * Bergson AudioContext Clock Tester
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global QUnit, fluid, berg*/
(function () {

    "use strict";

    fluid.registerNamespace("berg.test.clock");

    fluid.defaults("berg.test.clock.testCase.audioContext", {
        gradeNames: ["berg.test.clock.testCase.realtime"],

        invokers: {
            testInitState: {
                funcName: "berg.test.clock.testCase.audioContext.testInitial",
                args: ["{clock}", "{tester}", "{that}.options.maxJitter"]
            },

            testTick: {
                funcName: "berg.test.clock.testCase.audioContext.testTick",
                args: ["{clock}", "{arguments}.0", "{that}.options.maxJitter", "{tester}"]
            }
        }
    });

    berg.test.clock.testCase.audioContext.testInitial = function (clock, tester, maxJitter) {
        QUnit.equal(clock.freq, tester.model.expectedFreq,
            "The clock should be initialized with a freq of " +
            tester.model.expectedFreq + ".");
        berg.test.assertTimeEqual(clock.time, tester.model.expectedTime, maxJitter,
            "The clock should be initialized with the current time.");

        QUnit.equal(clock.tickDuration, tester.model.expectedTickDuration,
            "The clock should have been initialized with a tick duration of " +
            tester.model.expectedTickDuration + " seconds.");
    };

    berg.test.clock.testCase.audioContext.testTick = function (clock, time, maxJitter, tester) {
        var expectedTime = tester.model.expectedTime + tester.model.expectedTickDuration;

        berg.test.assertTimeEqual(clock.time, expectedTime, maxJitter,
            "The clock's time should reflect the current expected time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");

        tester.applier.change("expectedTime", expectedTime);
    };

    fluid.defaults("berg.test.clock.tester.audioContext", {
        gradeNames: [
            // TODO: The order of these two grades matters crucially. Why?
            "berg.test.clock.tester.external",
            "berg.test.clock.tester.realtime"
        ],

        maxJitter: 0.05,

        // TODO: These were moved into the model (instead of options)
        // do to expansion issues. But all other testers expect to find
        // these in the options. This should be normalized.
        model: {
            expectedTime: "{clock}.context.currentTime",
            expectedFreq: {
                expander: {
                    funcName: "berg.test.clock.tester.audioContext.calcFreq",
                    args: ["{clock}.context", "{clock}.options.blockSize"]
                }
            },
            expectedTickDuration: {
                expander: {
                    funcName: "berg.test.clock.tester.audioContext.calcTickDuration",
                    args: ["{clock}.context", "{clock}.options.blockSize"]
                }
            }
        },

        components: {
            testCase: {
                type: "berg.test.clock.testCase.audioContext"
            },

            clock: {
                type: "berg.clock.autoAudioContext"
            }
        }
    });


    berg.test.clock.tester.audioContext.calcFreq = function (context, blockSize) {
        return context.sampleRate / blockSize;
    };

    berg.test.clock.tester.audioContext.calcTickDuration = function (context, blockSize) {
        return blockSize / context.sampleRate;
    };
})();
