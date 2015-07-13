(function () {
    "use strict";

    fluid.registerNamespace("berg.test.scheduler");

    berg.test.scheduler.testInitial = function (s) {
        QUnit.ok(fluid.hasGrade(s.clock.options, "berg.clock"),
            "The scheduler has been configured with a clock instance");
        QUnit.equal(s.queue.items.length, 0, "The scheduler's queue is empty upon initialization.");
    };

    berg.test.scheduler.testQueue = function (s, expectedNumItems, expectedNext) {
        QUnit.equal(s.queue.items.length, expectedNumItems,
            "The queue should contain " + expectedNumItems + " items");

        if (expectedNext) {
            QUnit.deepEqual(s.queue.peek(), expectedNext,
                "The next item in the queue should match the expected item.");
        }
    };

    berg.test.scheduler.testCallback = function (clock, callbackArgs, expectedNow, expectedEventSpec) {
        QUnit.equal(clock.time, expectedNow,
            "The event should have been called back at the expected time.");
        QUnit.equal(callbackArgs[0], clock.time,
            "The callback should have been passed the current time as its first argument.");
        QUnit.deepEqual(callbackArgs[1], expectedEventSpec,
            "The callback's second argument should be the current event spec.");
    };

    fluid.defaults("berg.test.scheduler.testSequencer", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        name: "No test name was defined!",

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
                    args: ["{that}.options.name", "{that}.run"]
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

        scoreEventSpec: {},

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
                    func: "{scheduler}.once",
                    args: [
                        "{that}.options.scoreEventSpec.time", "{that}.events.onScheduledEvent.fire"
                    ]
                },

                // Check the queue's state.
                {
                    funcName: "berg.test.scheduler.testQueue",
                    args: ["{scheduler}", 1, "{that}.options.scoreEventSpec"]
                },

                "{scheduler}.clock.tick()",
                "{scheduler}.clock.tick()",
            ],

            onScheduledEvent: [
                {
                    funcName: "berg.test.scheduler.testCallback",
                    args: [
                        "{scheduler}.clock",
                        "{arguments}",
                        "{that}.options.expectedCallbackTime",
                        "{that}.options.scoreEventSpec"
                    ]
                },
                "berg.test.scheduler.testQueue({scheduler}, 0)",
                "QUnit.start()"
            ]
        }
    });
}());
