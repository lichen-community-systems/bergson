(function () {

    "use strict";

    fluid.defaults("berg.test.clock.testCase", {
        gradeNames: ["fluid.eventedComponent"],

        invokers: {
            testInitState: "fluid.identity()",
            testTick: "fluid.identity()"
        }
    });

    fluid.defaults("berg.test.clock.tester", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        numTicks: 60,

        maxJitter: 0,

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
                type: "fluid.emptySubcomponent",
                options: {
                    maxJitter: "{tester}.options.maxJitter"
                }
            },

            clock: {
                type: "berg.clock",
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
                    funcName: "berg.test.clock.tester.tickGuard",
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

    berg.test.clock.tester.tickGuard = function (that) {
        that.model.tickCount++;
        that.applier.change("tickCount", that.model.tickCount);

        if (that.model.tickCount >= that.options.numTicks) {
            that.events.onStop.fire();
            return false;
        }
    };


    fluid.defaults("berg.test.clock.testSuite", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        tests: [],

        invokers: {
            run: "berg.test.clock.testSuite.runTests({that})"
        }
    });

    berg.test.clock.testSuite.runTests = function (that) {
        fluid.each(that.options.tests, function (test) {
            var testFnName = test.initOnly || test.async === false ? "test" : "asyncTest";
            QUnit[testFnName](test.name, function () {
                var tester = fluid.initComponent(test.tester.type, test.tester.options);
                if (!test.initOnly) {
                    tester.start();
                }
            });
        });
    };

}());
