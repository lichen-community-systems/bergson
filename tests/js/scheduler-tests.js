/*
 * Bergson Scheduler Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    fluid.registerNamespace("berg.test.scheduler");

    QUnit.test("Instantiation", function () {
        var s = berg.scheduler();
        QUnit.ok(fluid.hasGrade(s.clock.options, "berg.clock.offline"),
            "The scheduler has been configured with a clock instance");
        QUnit.equal(s.queue.items.length, 0, "The scheduler's queue is empty upon initialization.");
    });

    QUnit.test("Schedule a callback once: setup", function () {
        var s = berg.scheduler({
            components: {
                clock: {
                    options: {
                        rate: 1/10
                    }
                }
            }
        });

        // Tick the clock once so we've got an offset clock time to check against.
        s.clock.tick();

        var callback = function () {};
        s.once(20, callback);
        QUnit.equal(s.queue.items.length, 1,
            "The queue should contain one item");
        QUnit.equal(s.queue.peek().callback, callback,
            "The specified callback should have been wrapped in an event specification object.");
        QUnit.equal(s.queue.peek().priority, 30,
            "The specified event time should have been normalized with the current clock time.");
    });

}());
