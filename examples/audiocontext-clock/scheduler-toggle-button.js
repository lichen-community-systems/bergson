fluid.defaults("berg.examples.schedulerToggleButton", {
    gradeNames: "fluid.viewComponent",

    model: {
        isPlaying: false,
        buttonLabel: "Start"
    },

    modelRelay: {
        target: "{that}.model.buttonLabel",
        singleTransform: {
            type: "fluid.transforms.free",
            func: "berg.examples.schedulerToggleButton.labelForPlayState",
            args: ["{that}.model.isPlaying"]
        }
    },

    modelListeners: {
        isPlaying: {
            funcName: "berg.examples.schedulerToggleButton.fireStateEvent",
            args: ["{change}.value", "{scheduler}"],
            excludeSource: "init"
        },

        buttonLabel: {
            "this": "{that}.container",
            method: "text",
            args: ["{change}.value"]
        }
    },

    invokers: {
        toggle: {
            funcName: "berg.examples.schedulerToggleButton.toggle",
            args: "{that}"
        }
    },

    events: {
        onButtonClick: null
    },

    listeners: {
        "onCreate.bindButtonClick": {
            "this": "{that}.container",
            method: "on",
            args: ["click", "{that}.events.onButtonClick.fire"]
        },

        "onButtonClick.toggle": {
            func: "{that}.toggle"
        }
    }
});

berg.examples.schedulerToggleButton.labelForPlayState = function (isPlaying) {
    return isPlaying ? "Stop" : "Start";
};

berg.examples.schedulerToggleButton.toggle = function (that) {
    that.applier.change("isPlaying", !that.model.isPlaying);
};

berg.examples.schedulerToggleButton.fireStateEvent = function (isPlaying, scheduler) {
    if (isPlaying) {
        scheduler.start();
    } else {
        scheduler.stop();
    }
};
