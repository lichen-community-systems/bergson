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

    fluid.defaults("berg.test.clock.audioContext", {
        gradeNames: "fluid.component",

        components: {
            clock: {
                type: "berg.clock.autoAudioContext",
                options: {
                    freq: 1
                }
            }
        }
    });

    QUnit.test("Instantiation", function () {
        let clock = berg.clock.autoAudioContext({
            freq: 1
        });
        QUnit.ok(clock, "Clock was successfully instantiated.");
    });

    QUnit.test("Start", function () {
        let clock = berg.clock.autoAudioContext({
            freq: 1
        });

        try {
            clock.start();
            QUnit.ok(true, "Clock successfully started.")
        } catch (e) {
            QUnit.ok(false, "Clock failed to start successfully", e);
        }
    });

    QUnit.test("Stop before start", function () {
        let clock = berg.clock.autoAudioContext({
            freq: 1
        });

        try {
            clock.stop();
            QUnit.ok(true, "Calling stop() before starting has no effect.");
        } catch (e) {
            QUnit.ok(false, "Calling stop() before starting failed.", e);
        }
    });

    QUnit.test("Stop after start", function () {
        let clock = berg.clock.autoAudioContext({
            freq: 1
        });

        try {
            clock.start();
            clock.stop();
            QUnit.ok(true, "Clock successfully stopped after starting.");
        } catch (e) {
            QUnit.ok(false, "Calling stop() after starting failed.", e);
        }
    });
})();
