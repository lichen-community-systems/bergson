fluid.defaults("berg.examples.schedulerToggleButton", {
    gradeNames: "fluid.viewComponent",

    model: {
        isPlaying: "{autoAudioContextClock}.model.isPlaying",
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
            funcName: "berg.examples.schedulerToggleButton.firePlayStateEvent",
            args: ["{change}.value", "{that}"],
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
        onButtonClick: null,
        onStart: "{autoAudioContextClock}.events.onStart",
        onStop: "{autoAudioContextClock}.events.onStop"
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

berg.examples.schedulerToggleButton.firePlayStateEvent = function (isPlaying, that) {
    if (isPlaying) {
        that.events.onStart.fire();
    } else {
        that.events.onStop.fire();
    }
};
