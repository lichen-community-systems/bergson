(function () {

    "use strict";

    fluid.registerNamespace("flock.test.perf.priorityQueue");

    flock.test.perf.priorityQueue.createRandomItem = function () {
        return {
            priority: Math.random()
        };
    };

    flock.test.perf.priorityQueue.createRandomItems = function (num) {
        var items = [];

        for (var i = 0; i < num; i++) {
            items.push(flock.test.perf.priorityQueue.createRandomItem());
        }

        return items;
    };

    flock.test.perf.priorityQueue.pushItems = function (spec) {
        for (var i = 0; i < spec.items.length; i++) {
            spec.q.push(spec.items[i]);
        }
    };

    flock.test.perf.priorityQueue.pushRandomItems = function (q, num) {
        for (var i = 0; i < num; i++) {
            q.push(flock.test.perf.priorityQueue.createRandomItem());
        }

        return q;
    };

    flock.test.perf.priorityQueue.makeRandomMultipleItemPusher = function (num) {
        return function () {
            var q = flock.priorityQueue();
            flock.test.perf.priorityQueue.pushRandomItems(q, num);
            return q;
        };
    };

    flock.test.perf.priorityQueue.randomItemPusher = function (q) {
        q.push({
            priority: Math.random()
        });
    };

    flock.test.perf.priorityQueue.popper = function (q) {
        q.pop();
    };

    flock.test.perf.priorityQueue.testSpecs = [
        {
            name: "Instantiating an empty priority queue",
            test: function () {
                flock.priorityQueue();
            }
        },

        {
            name: "Inserting 10000 items",
            numReps: 1000,
            setup: function () {
                return {
                    q: flock.priorityQueue(),
                    items: flock.test.perf.priorityQueue.createRandomItems(10000)
                };
            },
            test: flock.test.perf.priorityQueue.pushItems
        },

        {
            name: "Popping an item in a queue of 10000 items",
            setup: flock.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000),
            test: flock.test.perf.priorityQueue.popper
        },

        {
            name: "Popping an item in a queue of 10000000 items",
            setup: flock.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000000),
            test: flock.test.perf.priorityQueue.popper
        },

        {
            name: "Adding an item to a queue containing 10000 items",
            setup: flock.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000),
            test: flock.test.perf.priorityQueue.randomItemPusher
        },

        {
            name: "Pushing an item to a queue containing 10000000 items",
            setup: flock.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000000),
            test: flock.test.perf.priorityQueue.randomItemPusher
        }
    ];


    flock.test.perf.priorityQueue.run = function () {
        sheep.test(flock.test.perf.priorityQueue.testSpecs, true);
    };

}());
