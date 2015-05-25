(function () {

    "use strict";

    fluid.defaults("flock.test.clock.testCase", {
        gradeNames: ["fluid.eventedComponent"],

        invokers: {
            testInitState: "fluid.identity()",
            testTick: "fluid.identity()"
        }
    });

    fluid.defaults("flock.test.clock.tester", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        numTicks: 60,

        expected: {
            rate: 1
        },

        model: {
            tickCount: 0
        },

        invokers: {
            stop: "{that}.events.onStop.fire()"
        },

        components: {
            testCase: {
                type: "fluid.emptySubcomponent"
            },

            clock: {
                type: "flock.clock",
                options: {
                    rate: "{tester}.options.expected.rate",

                    events: {
                        onTick: "{tester}.events.onTick",
                        onCreate: "{tester}.events.onClockCreated"
                    }
                }
            }
        },

        events: {
            onClockCreated: null,
            onTick: "preventable",
            onStop: null
        },

        listeners: {
            onClockCreated: [
                {
                    namespace: "initializationTest",
                    func: "{testCase}.testInitState"
                }
            ],

            onTick: [
                {
                    priority: "first",
                    funcName: "flock.test.clock.tester.tickGuard",
                    args: ["{that}"]
                },
                {
                    priority: "last",
                    func: "{testCase}.testTick",
                    args: ["{arguments}.0"]
                }
            ]
        }
    });

    flock.test.clock.tester.tickGuard = function (that) {
        that.model.tickCount++;
        that.applier.change("tickCount", that.model.tickCount);

        if (that.model.tickCount >= that.options.numTicks) {
            that.events.onStop.fire();
            return false;
        }
    };


    fluid.defaults("flock.test.clock.testSuite", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        tests: [],

        invokers: {
            run: "flock.test.clock.testSuite.runTests({that})"
        },

        dynamicComponents: {
            tester: {
                createOnEvent: "onTest",
                type: "flock.test.clock.tester",
                options: {
                    expected: "{arguments}.0"
                }
            }
        },

        events: {
            onTest: null
        }
    });

    flock.test.clock.testSuite.runTests = function (that) {
        fluid.each(that.options.tests, function (test) {
            var testFnName = test.initOnly || test.async === false ? "test" : "asyncTest";
            QUnit[testFnName](test.name, function () {
                that.events.onTest.fire(test.expected);

                if (!test.initOnly) {
                    that.tester.start();
                }
            });
        });
    };

}());
