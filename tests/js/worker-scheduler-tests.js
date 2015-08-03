/*
 * Bergson Web Worker Scheduler Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    jqUnit = jqUnit || fluid.require("jqUnit"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    var QUnit = fluid.registerNamespace("QUnit");

    fluid.registerNamespace("berg.test.scheduler.workerProxy");

    berg.test.scheduler.workerProxy.createScheduler = function () {
        return berg.scheduler.workerProxy({
            remoteSchedulerOptions: {
                components: {
                    clock: {
                        type: "berg.clock.setInterval",
                        options: {
                            freq: 1
                        }
                    }
                }
            }
        });
    };

    QUnit.test("Instantiation", function () {
        var scheduler = berg.test.scheduler.workerProxy.createScheduler();
        QUnit.ok(scheduler, "The scheduler should have been instantiated.");
        QUnit.ok(scheduler.worker, "The scheduler's Web Worker instance should have been successfully created.");
        scheduler.destroy();
    });

    QUnit.asyncTest("Once callback", function () {
        var scheduler = berg.test.scheduler.workerProxy.createScheduler();
        var expectedEventSpec = {
            id: "my-event",
            type: "once",
            time: 10
        };

        scheduler.schedule({
            id: "my-event",
            type: "once",
            time: 10,
            callback: function (now, actualEventSpec) {
                QUnit.ok(typeof now === "number", "The current time should have been returned as a number");
                jqUnit.assertLeftHand("The callback should have been invoked with the eventSpec.", expectedEventSpec, actualEventSpec);
                QUnit.start();
                scheduler.destroy();
            }
        });
    });
}());
