/*
 * Bergson Scheduler Test Utilities
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
 /*global QUnit, jqUnit, fluid, berg*/
(function () {
    "use strict";

    fluid.registerNamespace("berg.test.scheduler");

    berg.test.scheduler.testInitial = function (s) {
        QUnit.ok(fluid.hasGrade(s.clock.options, "berg.clock"),
            "The scheduler has been configured with a clock instance");
        QUnit.equal(s.queue.items.length, 0, "The scheduler's queue is empty upon initialization.");
    };

    berg.test.scheduler.testQueue = function (s, expectedSequence, currentEventIdx) {
        var expectedQueueSize = expectedSequence[currentEventIdx - 1].queueSize;

        QUnit.equal(s.queue.items.length, expectedQueueSize,
            "The queue should contain " + expectedQueueSize + " items");
    };

    berg.test.scheduler.testCallback = function (scheduler, callbackArgs, scoreEventsSpecs, expectedSequence, currentEventIdx) {
        QUnit.ok(currentEventIdx < expectedSequence.length,
            "The number of event callbacks is within range of expected.");

        var sequenceSpec = expectedSequence[currentEventIdx],
            expectedEventSpec = scoreEventsSpecs[sequenceSpec.name];

        berg.test.assertTimeEqual(scheduler.clock.time, sequenceSpec.time, scheduler.lookahead,
            "Callback #" + currentEventIdx + " should have been called back at the expected time.");
        QUnit.equal(callbackArgs[0], scheduler.clock.time,
            "Callback #" + currentEventIdx + " should have been passed the current time as its first argument.");
        jqUnit.assertLeftHand(
            "Callback #" + currentEventIdx + "'s second argument should be the current event spec.",
            expectedEventSpec, callbackArgs[1]);
    };

    fluid.defaults("berg.test.scheduler.testSequencer", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        name: "No test name was defined!",
        scoreEventSpecs: {},
        registrationSequence: {},
        expectedSequence: [],

        model: {
            currentEventIdx: 0,
            tick: 0
        },

        schedulerOptions: {
            components: {
                clock: {
                    options: {
                        freq: 1 / 10
                    }
                }
            }
        },

        components: {
            scheduler: {
                type: "berg.scheduler",
                options: "{testSequencer}.options.schedulerOptions"
            }
        },

        invokers: {
            run: "{that}.events.onRun.fire",

            startClock: {
                func: "{scheduler}.clock.start"
            },

            evaluateRegistrationSequence: {
                funcName: "berg.test.scheduler.testSequencer.evaluateRegistrationSequence",
                args: ["{that}"]
            },

            scheduleEvent: {
                funcName: "berg.test.scheduler.testSequencer.scheduleEvent",
                args: ["{scheduler}", "{arguments}.0"]
            },

            testQueue: {
                funcName: "berg.test.scheduler.testQueue",
                dynamic: true,
                args: [
                    "{scheduler}",
                    "{that}.options.expectedSequence",
                    "{that}.model.currentEventIdx"
                ]
            }
        },

        events: {
            onRun: null,
            onScheduledEvent: null,
            onTick: null
        },

        listeners: {
            onCreate: [
                {
                    priority: "first",
                    funcName: "QUnit.asyncTest",
                    args: ["{that}.options.name", "{that}.run"],
                    nameSpace: "runTests"
                }
            ],

            onRun: [
                "{that}.evaluateRegistrationSequence()",
                "{that}.startClock()"
            ],

            "{scheduler}.clock.events.onTick": [
                {
                    funcName: "berg.test.scheduler.testSequencer.incrementTick",
                    args: ["{that}.applier", "{that}.model"]
                },
                "{that}.evaluateRegistrationSequence()"
            ],

            onScheduledEvent: [
                {
                    funcName: "berg.test.scheduler.testCallback",
                    args: [
                        "{scheduler}",
                        "{arguments}",
                        "{that}.options.scoreEventSpecs",
                        "{that}.options.expectedSequence",
                        "{that}.model.currentEventIdx"
                    ]
                },
                {
                    funcName: "berg.test.scheduler.testSequencer.updateModel",
                    args: ["{that}.applier", "{that}.model"],
                    namespace: "updateModel"
                },
                {
                    func: "{that}.testQueue"
                },
                {
                    funcName: "berg.test.scheduler.testSequencer.startAfterSequenceEnds",
                    args: [
                        "{that}.model.currentEventIdx",
                        "{that}.options.expectedSequence",
                        "{scheduler}.clock"
                    ]
                }
            ]
        }
    });

    berg.test.scheduler.testSequencer.startClock = function (clock) {
        clock.start();
    };

    berg.test.scheduler.testSequencer.scheduleEvent = function (s, eventSpec) {
        eventSpec = fluid.copy(eventSpec);
        s.schedule(eventSpec);
    };

    berg.test.scheduler.testSequencer.incrementTick = function (applier, model) {
        applier.change("tick", model.tick + 1);
    };

    berg.test.scheduler.testSequencer.updateModel = function (applier, model) {
        applier.change("currentEventIdx", model.currentEventIdx + 1);
    };

    berg.test.scheduler.testSequencer.evaluateRegistrationSequence = function (that) {
        if (!that.options.registrationSequence[that.model.tick]) {
            return;
        }

        fluid.each(that.options.registrationSequence[that.model.tick], function (eventSpecName) {
            var eventSpec = that.options.scoreEventSpecs[eventSpecName];
            if (!eventSpec) {
                QUnit.ok(false, "The registrationSequence was misconfigured. No scoreEventSpec named '" +
                    eventSpecName + "' was found. Registration sequence was: " +
                    fluid.prettyPrintJSON(that.options.registrationSequence));
            }
            eventSpec.callback = that.events.onScheduledEvent.fire;
            that.scheduleEvent(eventSpec);
        });
    };

    berg.test.scheduler.testSequencer.startAfterSequenceEnds = function (currentEventIdx, expectedSequence, clock) {
        if (currentEventIdx === expectedSequence.length) {
            clock.stop();
            QUnit.start();
        }
    };


    fluid.defaults("berg.test.scheduler.testSequencer.offline", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        invokers: {
            startClock: {
                funcName: "berg.test.scheduler.testSequencer.offline.driveClockSync",
                args: ["{scheduler}.clock", "{that}.options.numTicks"]
            }
        }
    });

    berg.test.scheduler.testSequencer.offline.driveClockSync = function (clock, numTicks) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
        }
    };

    fluid.defaults("berg.test.scheduler.offlineTestSequencer", {
        gradeNames: [
            "berg.test.scheduler.testSequencer",
            "berg.test.scheduler.testSequencer.offline",
            "autoInit"
        ]
    });

    fluid.defaults("berg.test.scheduler.onceTestSequencer", {
        gradeNames: ["berg.test.scheduler.offlineTestSequencer", "autoInit"],

        schedulerOptions: {
            components: {
                clock: {
                    options: {
                        freq: 1 / 10
                    }
                }
            }
        },

        invokers: {
            scheduleEvent: {
                funcName: "berg.test.scheduler.onceTestSequencer.scheduleEvent",
                args: [
                    "{scheduler}",
                    "{arguments}.0",
                    "{that}.events.onScheduledEvent.fire"
                ]
            }
        }
    });

    berg.test.scheduler.onceTestSequencer.scheduleEvent = function (s, eventSpec, onScheduledEvent) {
        s.once(eventSpec.time, onScheduledEvent);
    };

    fluid.defaults("berg.test.scheduler.repeatTestSequencer", {
        gradeNames: ["berg.test.scheduler.offlineTestSequencer", "autoInit"],

        invokers: {
            scheduleEvent: {
                funcName: "berg.test.scheduler.repeatTestSequencer.scheduleEvent",
                args: [
                    "{scheduler}",
                    "{arguments}.0",
                    "{that}.events.onScheduledEvent.fire"
                ]
            }
        }
    });

    berg.test.scheduler.repeatTestSequencer.scheduleEvent = function (s, eventSpec, onScheduledEvent) {
        s.repeat(eventSpec.freq, onScheduledEvent, eventSpec.time, eventSpec.end);
    };

}());
