(function () {

    "use strict";

    QUnit.module("Relative clock");

    fluid.defaults("flock.test.clock.relativeManual.tester", {
        gradeNames: [
            "flock.test.clock.tester.relative",
            "flock.test.clock.tester.manual",
            "autoInit"
        ]
    });

    QUnit.test("Initialization, default options", function () {
        flock.test.clock.relativeManual.tester();
    });

    QUnit.test("Initialization, 30 fps", function () {
        flock.test.clock.relativeManual.tester({
            expected: {
                rate: 30,
                tickDuration: 1/30
            }
        });
    });

    QUnit.test("tick() time update", function () {
        var tester = flock.test.clock.relativeManual.tester({
            expected: {
                rate: 30,
                tickDuration: 1/30
            }
        });
        tester.start();
    });

}());
