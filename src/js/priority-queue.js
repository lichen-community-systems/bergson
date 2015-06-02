/* Flocking Scheduler Priority Queue
 *
 * Based on Marijn Haverbeke's Binary Heap,
 * published in the 1st edition of Eloquent JavaScript
 * http://eloquentjavascript.net/1st_edition/appendix2.html
 *
 * License: Creative Commons Attribution 3.0 Unported
 * Copyright 2013 Marijn Haverbeke
 * Copyright 2015 Colin Clark
 */

(function() {

    "use strict";

    fluid.registerNamespace("flock");

    /**
     * Priority Queue
     *
     * Stores elements sorted by their order of priority.
     * This implementation uses a binary heap algorithm in order to
     * efficiently keep items sorted.
     *
     * @param {String} priorityProp the name of the property to use as the item's priority
     * @return the new queue instance
     */
    // TODO: Consider the performance consequence of the "priorityProp" scheme.
    flock.priorityQueue = function (priorityProp) {
        var that = {
            items: [],
            priorityProp: priorityProp || "priority"
        };

        /**
         * Adds a new item to the queue.
         *
         * @param the item to add
         */
        that.push = function (item) {
            if (!item) {
                return;
            }

            if (item[that.priorityProp] === undefined) {
                throw new Error("An item without a priority cannot be added to the queue.");
            }

            // Add the new element to the end of the array.
            that.items.push(item);
            // Allow it to bubble up.
            that.bubbleUp(that.items.length - 1);
        };

        /**
         * Returns the highest-priority element from the queue.
         * This method will not remove the item from the queue.
         *
         * @return the highest-priority element
         */
        that.peek = function () {
            return that.items[0];
        };

        /**
         * Removes the highest-priority element from the queue and returns it.
         *
         * @return the highest-priority element in the queue
         */
        that.pop = function () {
            // Store the first element so we can return it later.
            var result = that.items[0],
                end = that.items.pop();

            // If there are any elements left, put the end element at the
            // start, and let it sink down.
            if (that.items.length > 0) {
                that.items[0] = end;
                that.sinkDown(0);
            }

            return result;
        };

        /**
         * Removes the specified item from the queue.
         *
         * @param item the item to remove
         */
        that.remove = function (item) {
            var len = that.items.length;
            // To remove a value, we must search through the array to find it.
            for (var i = 0; i < len; i++) {
                if (that.items[i] != item) continue;
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = that.items.pop();
                // If the element we popped was the one we needed to remove,
                // we're done.
                if (i === len - 1) break;
                // Otherwise, we replace the removed element with the popped
                // one, and allow it to float up or sink down as appropriate.
                that.items[i] = end;
                that.bubbleUp(i);
                that.sinkDown(i);

                break;
            }
        };

        /**
         * Returns the number of items in the queue.
         *
         * @return the number of items
         */
        that.size = function () {
            return that.items.length;
        };

        /**
         * Clears all items from the queue.
         */
        that.clear = function () {
            that.items.length = 0;
        };

        // Unsupported, non-API method.
        that.bubbleUp = function (n) {
            // Fetch the element that has to be moved.
            var item = that.items[n];

            // When at 0, an element can not go up any further.
            while (n > 0) {
                // Compute the parent element's index, and fetch it.
                var parentN = (n - 1) >> 1,
                    parent = that.items[parentN];
                // If the parent has a lesser score, things are in order and we
                // are done.
                if (parent[that.priorityProp] <= item[that.priorityProp]){
                    break;
                }

                // Otherwise, swap the parent with the current element and
                // continue.
                that.items[parentN] = item;
                that.items[n] = parent;
                n = parentN;
            }
        };

        // Unsupported, non-API method.
        that.sinkDown = function (n) {
            // Look up the target element and its score.
            var length = that.items.length,
                item = that.items[n],
                child1;

            while (true) {
                // Compute the indices of the child elements.
                var child2N = (n + 1) * 2,
                    child1N = child2N - 1,
                    swap = null; // The new position of the item, if any.

                // If the first child exists (is inside the array)...
                if (child1N < length) {
                    // Look it up and compute its score.
                    child1 = that.items[child1N];

                    // If the score is less than our element's, we need to swap.
                    if (child1[that.priorityProp] < item[that.priorityProp]){
                        swap = child1N;
                    }
                }

                // Do the same checks for the other child.
                if (child2N < length) {
                    var child2 = that.items[child2N],
                        right = swap === null ? item : child1;

                    if (child2[that.priorityProp] < right[that.priorityProp]){
                        swap = child2N;
                    }
                }

                // No need to swap further, we are done.
                if (swap === null) {
                    break;
                }

                // Otherwise, swap and continue.
                that.items[n] = that.items[swap];
                that.items[swap] = item;
                n = swap;
            }
        };

        return that;
    };

}());
