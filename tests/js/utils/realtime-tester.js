(function () {

    "use strict";

    fluid.defaults("flock.test.clock.testCase.realtime", {
        gradeNames: ["flock.test.clock.testCase", "autoInit"],

        invokers: {
            testInitState: {
                funcName: "flock.test.clock.testCase.realtime.testInitial",
                args: ["{clock}", "{tester}"]
            },

            testTick: {
                funcName: "flock.test.clock.testCase.realtime.testTick",
                args: ["{clock}"]
            }
        }
    });

    flock.test.clock.testCase.realtime.testInitial = function (clock, that) {
        var now = performance.now();

        QUnit.equal(clock.options.rate, that.options.expected.rate,
            "The clock should be initialized with a rate of " +
            that.options.expected.rate + ".");
        flock.test.assertTimeEqual(clock.time, now, 3,
            "The clock should be initialized with the current time.");
    };

    flock.test.clock.testCase.realtime.testTick = function (clock) {
        flock.test.assertTimeEqual(clock.time, performance.now(), 3,
            "The clock time should reflect the current real time.");
    };


    fluid.defaults("flock.test.clock.tester.realtime", {
        gradeNames: ["flock.test.clock.tester", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.testCase.realtime"
            },

            clock: {
                type: "flock.clock.realtime"
            }
        }
    });

    // Tester mixin grade for clocks that are driven externally and thus:
    //   a) run asynchronously and need to signal QUnit to resume.
    //   b) need to be explicitly stopped.
    fluid.defaults("flock.test.clock.tester.external", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        invokers: {
            start: "{clock}.start()"
        },

        listeners: {
            onStop: [
                {
                    priority: "first",
                    func: "{clock}.stop"
                },
                {
                    priority: "last",
                    func: "QUnit.start"
                }
            ]
        }
    });
}());
