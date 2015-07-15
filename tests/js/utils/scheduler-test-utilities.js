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

    berg.test.scheduler.testCallback = function (clock, callbackArgs, scoreEventsSpecs, expectedSequence, currentEventIdx) {
        var sequenceSpec = expectedSequence[currentEventIdx],
            expectedEventSpec = scoreEventsSpecs[sequenceSpec.name];

        QUnit.equal(clock.time, sequenceSpec.time,
            "The callback should have been called back at the expected time.");
        QUnit.equal(callbackArgs[0], clock.time,
            "The callback should have been passed the current time as its first argument.");
        QUnit.deepEqual(callbackArgs[1], expectedEventSpec,
            "The callback's second argument should be the current event spec.");
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

        schedulerOptions: {},

        components: {
            scheduler: {
                type: "berg.scheduler",
                options: "{testSequencer}.options.schedulerOptions"
            }
        },

        invokers: {
            run: "{that}.events.onRun.fire",

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
                "{scheduler}.clock.start()",
                "{that}.schedule()",
                "berg.test.scheduler.driveClockSync({scheduler}.clock, {that}.options.numTicks)"
            ],

            "{scheduler}.clock.events.onTick": [
                {
                    funcName: "berg.test.scheduler.incrementTick",
                    args: ["{that}.applier", "{that}.model"]
                },
                "{that}.schedule()"
            ],

            onScheduledEvent: [
                {
                    funcName: "berg.test.scheduler.testCallback",
                    args: [
                        "{scheduler}.clock",
                        "{arguments}",
                        "{that}.options.scoreEventSpecs",
                        "{that}.options.expectedSequence",
                        "{that}.model.currentEventIdx"
                    ]
                },
                {
                    funcName: "berg.test.scheduler.onceTestSequencer.updateModel",
                    args: ["{that}.applier", "{that}.model"],
                    namespace: "updateModel"
                },
                {
                    func: "{that}.testQueue"
                },
                {
                    funcName: "berg.test.scheduler.startAfterSequenceEnds",
                    args: [
                        "{that}.model.currentEventIdx",
                        "{that}.options.expectedSequence",
                        "{scheduler}.clock"
                    ]
                }
            ]
        }
    });

    fluid.defaults("berg.test.scheduler.onceTestSequencer", {
        gradeNames: ["berg.test.scheduler.testSequencer", "autoInit"],

        schedulerOptions: {
            components: {
                clock: {
                    options: {
                        rate: 1/10
                    }
                }
            }
        },

        invokers: {
            schedule: {
                funcName: "berg.test.scheduler.schedule",
                dynamic: true,
                args: [
                    "{scheduler}",
                    "{that}.model.tick",
                    "{that}.options.registrationSequence",
                    "{that}.options.scoreEventSpecs",
                    "{that}.events.onScheduledEvent.fire"
                ]
            }
        }
    });

    berg.test.scheduler.incrementTick = function (applier, model) {
        applier.change("tick", model.tick + 1);
    };

    berg.test.scheduler.schedule = function (s, tick, registrationSequence, scoreEventSpecs, onScheduledEvent) {
        if (!registrationSequence[tick]) {
            return;
        }

        fluid.each(registrationSequence[tick], function (eventSpecName) {
            var eventSpec = scoreEventSpecs[eventSpecName];
            if (!eventSpec) {
                ok(false, "The registrationSequence was misconfigured. No scoreEventSpec named '" +
                    eventSpecName + "' was found. Registration sequence was: " +
                    fluid.prettyPrintJSON(registrationSequence));
            }
            eventSpec.callback = onScheduledEvent;
            s.once(eventSpec.time, onScheduledEvent);
        });
    };

    berg.test.scheduler.onceTestSequencer.updateModel = function (applier, model) {
        applier.change("currentEventIdx", model.currentEventIdx + 1);
    };

    berg.test.scheduler.startAfterSequenceEnds = function (currentEventIdx, expectedSequence, clock) {
        if (currentEventIdx === expectedSequence.length) {
            clock.stop();
            QUnit.start();
        }
    };

    berg.test.scheduler.driveClockSync = function (clock, numTicks) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
        }
    };

}());
