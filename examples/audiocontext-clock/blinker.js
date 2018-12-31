fluid.defaults("berg.examples.blinker", {
    gradeNames: "fluid.viewComponent",

    invokers: {
        blink: {
            funcName: "berg.examples.blinker.blink",
            args: ["{that}.container"]
        },

        unblink: {
            funcName: "berg.examples.blinker.unblink",
            args: ["{that}.container"]
        }
    },

    events: {
        onStart: "{autoAudioContextClock}.events.onStart",
        onStop: "{autoAudioContextClock}.events.onStop"
    },

    listeners: {
        "onStop.unblink": {
            func: "{that}.unblink"
        }
    }
});

berg.examples.blinker.blink = function (blinky) {
    blinky.addClass("blink");
    blinky.removeClass("unblink");

};
berg.examples.blinker.unblink = function (blinky) {
    blinky.removeClass("blink");
    blinky.addClass("unblink");
};
