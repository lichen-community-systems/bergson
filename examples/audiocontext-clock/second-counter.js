fluid.defaults("berg.examples.tickCounter", {
    gradeNames: "fluid.viewComponent",

    model: {
        ticksActive: 0
    },

    modelListeners: {
        ticksActive: {
            funcName: "berg.examples.tickCounter.updateText",
            args: ["{change}.value", "{that}.container"]
        }
    },

    invokers: {
        count: {
            funcName: "berg.examples.tickCounter.count",
            args: ["{that}"]
        }
    }
});

berg.examples.tickCounter.updateText = function (ticksActive, container) {
    container.text(ticksActive);
};

berg.examples.tickCounter.count = function (that) {
    that.applier.change("ticksActive", that.model.ticksActive + 1);
};
