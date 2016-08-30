Bergson
=======

What is Bergson?
----------------

Bergson is the scheduling system for [Flocking](https://github.com/colinbdclark/Flocking) and [Aconite](https://github.com/colinbdclark/aconite). It provides a variety of clocks driven by different
sources (such as requestAnimationFrame, the Web Audio API, and setInterval), and a priority queue-based
scheduler that allows you to queue up one-time and repeating function calls.

Bergson provides a very low-level API for scheduling, and is intended for library developers to build
their own rhythmic and pattern-based abstractions on top of.

Examples
--------

### Creating a Scheduler with the requestAnimationFrame Clock ###

    var scheduler = berg.scheduler({
        components: {
            clock: {
                type: "berg.clock.requestAnimationFrame",
                options: {
                    freq: 60
                }
            }
        }
    });

    scheduler.start();

### Scheduling one-time events ###

    scheduler.schedule({
        type: "once",
        time: 30            // 30 seconds from now
        callback: function (now) {
            // Do something in the future.
        }
    });

### Scheduling repeating events ###

    scheduler.schedule({
        type: "repeat",
        time: 5,            // Start repeating five seconds from now.
        freq: 2,            // Repeat every two seconds.
        end: 20,            // Stop repeating 20 seconds from now.
        callback: function (now) {
            // Do something repeatedly.
        }
    });

### Listening for Clock Events Directly ###

    scheduler.clock.events.onTick.addListener(function (time, rate) {
        // Do something every time the clock ticks.
    });


Bergson API
-------------

### Scheduler API ###

#### Score Event Specifications ####

A _score event specification_ is a JSON-type (i.e. plain old, non-prototypal) object that describes the event to be scheduled. It can contain the following properties.

<table>
    <tr>
        <th>Property</th>
        <th>Value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>type</td>
        <td><code>"once"</code> or <code>"repeat"</code></td>
        <td>The type of event to schedule (either one-time or repeating).</td>
    </tr>
    <tr>
        <td>time</td>
        <td>Number</td>
        <td>The future time in seconds when the scheduled event should occur.</td>
    </tr>
    <tr>
        <td>freq</td>
        <td>Number</td>
        <td>(Only for repeating events) The frequency at which the event should repeat.</td>
    </tr>
    <tr>
        <td>end</td>
        <td>Number</td>
        <td>(Only for repeating events) The future time in seconds when the scheduled event should stop repeating.</td>
    </tr>
    <tr>
        <td>callback</td>
        <td>Function</td>
        <td>The function to invoke.</td>
    </tr>
</table>

#### Scheduler Model ####

For more information on interacting with models, see the [Infusion documentation about the Change Applier](http://docs.fluidproject.org/infusion/development/ChangeApplierAPI.html).

<table>
    <tr>
        <th>Property</th>
        <th>Description</th>
        <th>Types</th>
    </tr>
    <tr>
        <td>timeScale</td>
        <td>The scheduler's time scale factor. Defaults to 1.0.</td>
        <td>Number</td>
    </tr>
</table>

#### Scheduler Members ####

<table>
    <tr>
        <th>Property</th>
        <th>Description</th>
        <th>Types</th>
    </tr>
    <tr>
        <td>queue</td>
        <td>The priority queue used to sort and queue score events.</td>
        <td><code>berg.priorityQueue</code></td>
    </tr>
</table>

#### Scheduler Methods ####

<table>
    <tr>
        <th>Method</th>
        <th>Description</th>
        <th>Argument Types</th>
        <th>Returns</th>
    </tr>
    <tr>
        <td>start</td>
        <td>Starts the scheduler and its clock.</td>
        <td>none</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>stop</td>
        <td>Stops the scheduler and its clock.</td>
        <td>none</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>schedule
        <td>Schedules an event</td>
        <td>A _score event specification_ object</td>
        <td>The scheduled score event specification.</td>
    </tr>
    <tr>
        <td>clear</td>
        <td>Removes a scheduled event from the scheduler queue.</td>
        <td>The _score event specification_ to clear.</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>clearAll</td>
        <td>Removes all scheduled events from the scheduler queue.</td>
        <td>none</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>setTimeScale</td>
        <td>Sets the time scale factor for the scheduler. This will cause all time values for current and future scheduled events to be scaled by the specified value.</td>
        <td><code>Number</code></td>
        <td><code>undefined</code></td>
    </tr>
</table>

### Clock API ###

#### Clock Members ####

<table>
    <tr>
        <th>Property</th>
        <th>Description</th>
        <th>Types</th>
    </tr>
    <tr>
        <td>time</td>
        <td>The current clock time, in seconds.</td>
        <td>Number</td>
    </tr>
    <tr>
        <td>freq</td>
        <td>The clock's frequency, in cyles per second.</td>
        <td>Number</td>
    </tr>
    <tr>
        <td>tickDuration</td>
        <td>The duration between ticks, in seconds.</td>
        <td>Number</td>
    </tr>
</table>

#### Clock Methods ####

<table>
    <tr>
        <th>Method</th>
        <th>Description</th>
        <th>Argument Types</th>
        <th>Returns</th>
    </tr>
    <tr>
        <td>start</td>
        <td>Starts the clock.</td>
        <td>none</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>stop</td>
        <td>Stops clock.</td>
        <td>none</td>
        <td><code>undefined</code></td>
    </tr>
    <tr>
        <td>tick</td>
        <td>Advances the clock's time. (This will be invoked automatically for most clocks.)</td>
        <td>None</td>
        <td><code>undefined</code></td>
    </tr>
</table>

#### Clock Events ####

<table>
    <tr>
        <th>Event Name</th>
        <th>Description</th>
        <th>Argument Types</th>
    </tr>
    <tr>
        <td>onTick</td>
        <td>Fires each time the clock ticks.</td>
        <td><code>Number</code> time: the current clock time in seconds</td>
    </tr>
</table>

Types of Clocks
---------------

<table>
    <tr>
        <th>Clock</th>
        <th>Description</th>
        <th>Default rate</th>
    </tr>
    <tr>
        <td><code>berg.clock.requestAnimationFrame</code></td>
        <td>A clock that is driven at (or as near as possible to) the display's refresh rate by the browser's built-in <code>requestAnimationFrame</code> function. Note that this clock will be throttled down to
        1 Hz automatically by the browser if its tab is not active.</td>
        <td>60 Hz. You must override this value if your display is running a different refresh rate.</td>
    </tr>
    <tr>
        <td><code>berg.clock.audioContext</code></td>
        <td>Uses the Web Audio API's <code>AudioContext</code> as a source of time. This clock
        needs to be driven by your own ScriptProcessorNode code (i.e. by calling its <code>tick()</code> method within your <code>onaudioprocess</code> handler).</td>
        <td>Dynamically determined based on the AudioContext's <code>sampleRate</code> and this clock's <code>blockSize</code> option.</td>
    </tr>
    <tr>
        <td><code>berg.clock.autoAudioContext</code></td>
        <td>An AudioContext-based clock that will automatically create a <code>ScriptProcessorNode</code> instance and wire it up correctly for you. Use this if you're not using the Web Audio API directly, but want a rock-solid clock for scheduling events in your application.</td>
        <td>Dynamically determined based on the AudioContext's <code>sampleRate</code> and this clock's <code>blockSize</code> option.</td>
    </tr>
    <tr>
        <td><code>berg.clock.setInterval</code></td>
        <td>A clock that is driven by the browser's built-in (and notoriously jittery) <code>setInterval</code> function. Use this if you don't need significant reliability, and want maximal cross-environment compatibility (e.g. with Node.js). Note that this clock will be throttled down automatically
        by the browser if its tab is not active.</td>
        <td>10 Hz</td>
    </tr>
    <tr>
        <td><code>berg.clock.workerSetInterval</code></td>
        <td>Like <code>berg.clock.setInterval</code>, except that it employs a Web Worker in order to avoid
        the standard throttling done by browsers when the page is in the background.</td>
        <td>10 Hz</td>
    </tr>
    <tr>
        <td><code>berg.clock.offline</code></td>
        <td>A base grade for creating your own types of clocks.
        An offline clock tracks time relatively (i.e. without reference to a "real" source of time
        such as the system clock). This clock should be driven manually by invoking its tick() method.</td>
        <td>1 Hz</td>
    </tr>
    <tr>
        <td><code>berg.clock.realtime</code></td>
        <td>A base grade for creating your own types of clocks.
        A realtime clock tracks time based on the actual system time using,
        by default, <code>performance.now()</code>.
        This clock should be driven manually by invoking its tick() method.</td>
        <td>1 Hz</td>
    </tr>
</table>

Building and Testing Bergson
-----------------------------

### How to Build Bergson

You'll need Grunt installed globally if you don't already have it. Here's how:

    npm install -g grunt-cli

To download all of Bergson's dependencies, build them, and then build Bergson itself, run the following commands:

    npm install
    grunt

### Running Bergson's Test Suite

Bergson's test suite can be run both in Node.js and in all available browsers using Testem. To run the browser tests, you'll need to have Testem installed globally if you don't already. Here's how:

    npm install testem -g

Then, the whole test suite can be run on both Node.js and all of the browsers installed on your computer:

    npm test

If you'd like to run only the Node.js tests, run:

    npm run node-test

Or if you only want to run the browser tests:

    npm run browser-test

Alternatively, if you'd like to only run the tests in one browser, you can open the test suite ``tests/unit/all-tests.html`` file by hand in your browser.

Community
---------

Bergson is supported by the Flocking community and uses its forums:

### Mailing List
The [Flocking mailing list](http://lists.idrc.ocadu.ca/mailman/listinfo/flocking)
is the place to ask questions, share code, and request new features.

### Chat
Flocking has an IRC channel, which can also be used to ask questions about Bergson. Join <code>#flocking</code> on <code>irc.freenode.net</code>.

Credits and License
-------------------

Bergson is written and maintained by Colin Clark. It is dually licensed under the MIT and GPL 2.0 licenses.
