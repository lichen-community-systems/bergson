/*jshint node:true*/

var fluid = require("infusion"),
    berg = fluid.registerNamespace("berg"),
    loader = fluid.getLoader(__dirname);

loader.require("./src/js/clock.js");
loader.require("./src/js/setinterval-clock.js");
loader.require("./src/js/priority-queue.js");
loader.require("./src/js/clock-logger.js");
loader.require("./src/js/scheduler.js");

module.exports = berg;
