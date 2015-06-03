(function () {

    "use strict";

    fluid.registerNamespace("flock.test.priorityQueue");

    QUnit.module("Priority Queue Tests");

    QUnit.test("Instantiation", function () {
        var q = flock.priorityQueue();
        QUnit.equal(q.items.length, 0, "The queue should have no items initially.");
        QUnit.equal(q.peek(), undefined,
            "Peeking at the queue should return undefined when it's empty.");
        QUnit.equal(q.pop(), undefined,
            "Popping an item from the queue when it's empty should return undefined.");
    });

    flock.test.priorityQueue.testPushNothing = function (q, nothing) {
        q.push(nothing);
        QUnit.equal(q.items.length, 0,
            "Nothing should happen when a non-value is pushed onto the queue.");
    };

    flock.test.priorityQueue.testPushInvalidItem = function (q, item) {
        var success = false;
        try {
            q.push(item);
        } catch (e) {
            success = true;
        }

        ok(success, "The queue should throw an Error if an invalid value is pushed into it.");
    };

    flock.test.priorityQueue.orderTestSpec = {
        items: [
            {
                priority: -10
            },
            {
                priority: 1000
            },
            {
                priority: -1000
            },
            {
                priority: 1
            }
        ],

        expectedOrder: [2, 0, 3, 1]
    };

    flock.test.priorityQueue.popper = function (q) {
        return q.pop();
    };

    flock.test.priorityQueue.peeker = function (q) {
        return q.peek();
    };

    flock.test.priorityQueue.pushItems = function (q, testSpec) {
        fluid.each(testSpec.items, function (item) {
            q.push(item);
        });
    };

    flock.test.priorityQueue.testItemsRetrieved = function (q, testSpec, getter) {
        fluid.each(testSpec.expectedOrder, function (idx) {
            var item = getter(q);
            QUnit.equal(item, testSpec.items[idx],
                "The item should be retrieved in the correct order.");
        });
    };

    flock.test.priorityQueue.testOrder = function (q, testSpec, getter) {
        QUnit.equal(testSpec.items.length, testSpec.expectedOrder.length,
            "There should be an equal number of items pushed and popped. Check your test case for errors.");
        flock.test.priorityQueue.pushItems(q, testSpec);
        flock.test.priorityQueue.testItemsRetrieved(q, testSpec, getter);
    };

    QUnit.test("Adding items", function () {
        var q = flock.priorityQueue();
        flock.test.priorityQueue.testPushNothing(q, undefined);
        flock.test.priorityQueue.testPushNothing(q, null);
        flock.test.priorityQueue.testPushNothing(q, 0);
        flock.test.priorityQueue.testPushInvalidItem(q, 1000);
        flock.test.priorityQueue.testPushInvalidItem(q, {
            cat: "meow"
        });

        q.push({
            cat: "meow",
            priority: -1000
        });
        equal(q.items.length, 1,
            "When a valid item is pushed, it should be added to the queue's list of items.");
    });

    QUnit.test("Push/pop order", function () {
        var q = flock.priorityQueue();
        flock.test.priorityQueue.testOrder(q,
            flock.test.priorityQueue.orderTestSpec,
            flock.test.priorityQueue.popper);

        QUnit.equal(q.items.length, 0,
            "The queue should be empty after all items have been popped off it.");
    });

    QUnit.test("Push/peek", function () {
        var q = flock.priorityQueue();
        flock.test.priorityQueue.pushItems(q, flock.test.priorityQueue.orderTestSpec);
        var result = q.peek(),
            expectedIdx = flock.test.priorityQueue.orderTestSpec.expectedOrder[0],
            expected = flock.test.priorityQueue.orderTestSpec.items[expectedIdx];

        QUnit.equal(result, expected,
            "The highest priority item should be returned when peeking at the queue.");
        QUnit.equal(q.items.length,
            flock.test.priorityQueue.orderTestSpec.items.length,
            "The queue should be fully populated after each item has been peeked at.");
    });

    QUnit.test("Push/remove", function () {
        var q = flock.priorityQueue();
        flock.test.priorityQueue.pushItems(q, flock.test.priorityQueue.orderTestSpec);
        QUnit.equal(q.size(), 4, "There should be four items in the queue prior to removing one.");

        var itemToRemove = flock.test.priorityQueue.orderTestSpec.items[3];
        q.remove(itemToRemove);
        QUnit.equal(q.items.indexOf(itemToRemove), -1,
            "The item should have been removed.");
        QUnit.equal(q.size(), 3,
            "There should be only three items in the queue after remove the third-lowest priority one.");
    });
}());
