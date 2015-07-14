(function () {
    "use strict";

    fluid.registerNamespace("berg.test.scheduler");

    berg.test.scheduler.testInitial = function (s) {
        QUnit.ok(fluid.hasGrade(s.clock.options, "berg.clock"),
            "The scheduler has been configured with a clock instance");
        QUnit.equal(s.queue.items.length, 0, "The scheduler's queue is empty upon initialization.");
    };

    berg.test.scheduler.testQueue = function (s, scoreEventSpecs, expectedSequence, currentEventIdx) {
        // TODO: Fix this!
        var expectedInQueue = Object.keys(scoreEventSpecs).length - currentEventIdx;

        QUnit.equal(s.queue.items.length, expectedInQueue,
            "The queue should contain " + expectedInQueue + " items");

        if (currentEventIdx < expectedSequence.length) {

            var nextInSequence = expectedSequence[currentEventIdx],
                expectedNext = scoreEventSpecs[nextInSequence.name];

            QUnit.deepEqual(s.queue.peek(), expectedNext,
                "The next item in the queue should match the expected item.");
        }
    };

    berg.test.scheduler.scheduleAll = function (scheduler, specs, onScheduledEvent) {
        // TODO: Add the ability for tests to define order relative to clock ticks.
        fluid.each(specs, function (spec) {
            scheduler.once(spec.time, onScheduledEvent)
        });
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

        model: {
            currentEventIdx: 0
        },

        components: {
            scheduler: {
                type: "berg.scheduler",
                options: "{testSequencer}.options.schedulerOptions"
            }
        },

        invokers: {
            run: "{that}.events.onRun.fire"
        },

        events: {
            onRun: null,
            onScheduledEvent: null
        },

        listeners: {
            onCreate: [
                {
                    priority: "first",
                    funcName: "QUnit.asyncTest",
                    args: ["{that}.options.name", "{that}.run"],
                    nameSpace: "runTests"
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

        scoreEventSpecs: {},
        expectedSequence: [],

        invokers: {
            testQueue: {
                funcName: "berg.test.scheduler.testQueue",
                dynamic: true,
                args: [
                    "{scheduler}",
                    "{that}.options.scoreEventSpecs",
                    "{that}.options.expectedSequence",
                    "{that}.model.currentEventIdx"
                ]
            }
        },

        listeners: {
            onRun: [
                 // Tick the clock once
                 // so we've got an offset clock time to check against.
                {
                    func: "{scheduler}.clock.tick",
                    namespace: "firstTick"
                },

                // Schedule an event.
                {
                    funcName: "berg.test.scheduler.scheduleAll",
                    args: [
                        "{scheduler}",
                        "{that}.options.scoreEventSpecs",
                        "{that}.events.onScheduledEvent.fire"
                    ]
                },

                {
                    func: "{that}.testQueue"
                },

                "{scheduler}.clock.tick()",
                "{scheduler}.clock.tick()",
                "{scheduler}.clock.tick()",
                "{scheduler}.clock.tick()"
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
                    funcName: "berg.test.scheduler.startWhenExpected",
                    args: [
                        "{that}.model.currentEventIdx",
                        "{that}.options.expectedSequence"
                    ]
                }
            ]
        }
    });

    berg.test.scheduler.onceTestSequencer.updateModel = function (applier, model) {
        var newVal = model.currentEventIdx + 1;
        applier.change("currentEventIdx", newVal);
    };

    berg.test.scheduler.startWhenExpected = function (currentEventIdx, expectedSequence) {
        if (currentEventIdx === expectedSequence.length) {
            QUnit.start();
        }
    };

}());
