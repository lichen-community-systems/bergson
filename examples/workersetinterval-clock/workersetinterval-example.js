fluid.defaults("berg.examples.workerSetIntervalClock", {
    gradeNames: "fluid.viewComponent",

    model: {
        tickCount: 0
    },

    components: {
        clock: {
            type: "berg.clock.workerSetInterval",
            options: {
                freq: 1
            }
        }
    },
    modelListeners: {
        tickCount: {
            "this": "{that}.dom.tickCounter",
            method: "text",
            args: ["{change}.value"]
        }
    },

    events: {
        onButtonClick: null,
        onTick: "{clock}.events.onTick"
    },

    listeners: {
        "onCreate.bindButtonClick": {
            "this": "{that}.dom.button",
            method: "click",
            args: ["{that}.events.onButtonClick.fire"]
        },

        "onButtonClick.resetCounter": {
            changePath: "tickCount",
            value: 0
        },

        "onButtonClick.stopClock": "{clock}.stop()",

        "onButtonClick.startClock": "{clock}.start()",

        "onTick.count": {
            funcName: "berg.examples.workerSetIntervalClock.countTick",
            args: ["{that}"]
        },

        "onTick.stopAfterTen": {
            priority: "after:count",
            funcName: "berg.examples.workerSetIntervalClock.stopAfterTen",
            args: ["{that}"]
        }
    },

    selectors: {
        tickCounter: ".tickCounter",
        button: "button"
    }
});

berg.examples.workerSetIntervalClock.countTick = function (that) {
    that.applier.change("tickCount", that.model.tickCount + 1);
};

berg.examples.workerSetIntervalClock.stopAfterTen = function (that) {
    if (that.model.tickCount === 10) {
        that.clock.stop();
    }
};
