/*
 * Bergson Realtime Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global QUnit, fluid, berg*/
(function () {
    "use strict";

    QUnit.module("AudioContext clock");

    fluid.defaults("berg.test.clock.audioContextClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.audioContext"
                }
            },
            {
                name: "tick()",
                async: true,
                tester: {
                    type: "berg.test.clock.tester.audioContext"
                }
            }
        ]
    });

    var suite = berg.test.clock.audioContextClockTestSuite();
    suite.run();

}());
