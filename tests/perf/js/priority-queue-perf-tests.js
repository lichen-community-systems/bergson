/*
 * Bergson Priority Queue Performance Benchmarks
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global sheep, fluid, berg*/
(function () {
    "use strict";

    fluid.registerNamespace("berg.test.perf.priorityQueue");

    berg.test.perf.priorityQueue.createRandomItem = function () {
        return {
            priority: Math.random()
        };
    };

    berg.test.perf.priorityQueue.createRandomItems = function (num) {
        var items = [];

        for (var i = 0; i < num; i++) {
            items.push(berg.test.perf.priorityQueue.createRandomItem());
        }

        return items;
    };

    berg.test.perf.priorityQueue.pushItems = function (spec) {
        for (var i = 0; i < spec.items.length; i++) {
            spec.q.push(spec.items[i]);
        }
    };

    berg.test.perf.priorityQueue.pushRandomItems = function (q, num) {
        for (var i = 0; i < num; i++) {
            q.push(berg.test.perf.priorityQueue.createRandomItem());
        }

        return q;
    };

    berg.test.perf.priorityQueue.makeRandomMultipleItemPusher = function (num) {
        return function () {
            var q = berg.priorityQueue();
            berg.test.perf.priorityQueue.pushRandomItems(q, num);
            return q;
        };
    };

    berg.test.perf.priorityQueue.randomItemPusher = function (q) {
        q.push({
            priority: Math.random()
        });
    };

    berg.test.perf.priorityQueue.popper = function (q) {
        q.pop();
    };

    berg.test.perf.priorityQueue.testSpecs = [
        {
            name: "Instantiating an empty priority queue",
            test: function () {
                berg.priorityQueue();
            }
        },

        {
            name: "Inserting 10000 items",
            numReps: 1000,
            setup: function () {
                return {
                    q: berg.priorityQueue(),
                    items: berg.test.perf.priorityQueue.createRandomItems(10000)
                };
            },
            test: berg.test.perf.priorityQueue.pushItems
        },

        {
            name: "Popping an item in a queue of 10000 items",
            setup: berg.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000),
            test: berg.test.perf.priorityQueue.popper
        },

        {
            name: "Popping an item in a queue of 10000000 items",
            setup: berg.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000000),
            test: berg.test.perf.priorityQueue.popper
        },

        {
            name: "Adding an item to a queue containing 10000 items",
            setup: berg.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000),
            test: berg.test.perf.priorityQueue.randomItemPusher
        },

        {
            name: "Pushing an item to a queue containing 10000000 items",
            setup: berg.test.perf.priorityQueue.makeRandomMultipleItemPusher(10000000),
            test: berg.test.perf.priorityQueue.randomItemPusher
        }
    ];


    berg.test.perf.priorityQueue.run = function () {
        sheep.test(berg.test.perf.priorityQueue.testSpecs, true);
    };

}());
