(function () {

    "use strict";

    QUnit.module("Realtime clock");

    fluid.defaults("flock.test.clock.realtimeManual.tester", {
        gradeNames: [
            "flock.test.clock.tester.realtime",
            "flock.test.clock.tester.manual",
            "autoInit"
        ]
    });

    QUnit.test("Initialization, default options", function () {
        flock.test.clock.realtimeManual.tester();
    });

    QUnit.test("Initialization, 30 fps", function () {
        flock.test.clock.realtimeManual.tester({
            expected: {
                rate: 30
            }
        });
    });

    QUnit.test("tick() time update", function () {
        var tester = flock.test.clock.realtimeManual.tester({
            expected: {
                rate: 30
            }
        });

        tester.start();
    });

}());
