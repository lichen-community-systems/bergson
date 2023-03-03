/*
 * Bergson AudioContext Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2023, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    var QUnit = fluid.registerNamespace("QUnit");

    fluid.registerNamespace("berg.test.AudioContextClock");

    QUnit.module("AudioContext Clock Tests");

    fluid.defaults("berg.test.clock.autoAudioContextClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.audioContext"
                }
            },

            {
                name: "tick() time update",
                tester: {
                    type: "berg.test.clock.tester.audioContext"
                }
            }
        ]
    });

    var testSuite = berg.test.clock.autoAudioContextClockTestSuite();
    testSuite.run();

    QUnit.test("Instantiation", function () {
        var clock = berg.clock.autoAudioContext();
        QUnit.ok(clock, "Clock was successfully instantiated.");
    });

    QUnit.test("Start", function () {
        var clock = berg.clock.autoAudioContext();

        try {
            clock.start();
            QUnit.ok(clock.model.isPlaying, "Clock successfully started.");
        } catch (e) {
            QUnit.ok(false, "Clock failed to start successfully: " + e.message);
        }
    });

    QUnit.test("Stop before start", function () {
        var clock = berg.clock.autoAudioContext();

        try {
            clock.stop();
            QUnit.ok(!clock.model.isPlaying, "Calling stop() before starting has no effect.");
        } catch (e) {
            QUnit.ok(false, "Calling stop() before starting failed: " + e.message);
        }
    });

    QUnit.asyncTest("Start, stop, restart, stop sequence", function () {
        var clock = berg.clock.autoAudioContext();

        clock.start();
        QUnit.ok(clock.model.isPlaying, "Calling start was successful.");
        clock.stop();
        QUnit.ok(!clock.model.isPlaying, "Calling stop was successful.");
        clock.start();
        QUnit.ok(clock.model.isPlaying,
            "Calling start after stopping was successful.");

        setInterval(function () {
            clock.stop();
            QUnit.ok(!clock.model.isPlaying,
                "Calling stop again after waiting for a bit was successful.");
            QUnit.start();
        }, 100);
    });
})();
