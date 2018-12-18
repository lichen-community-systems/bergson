// TODO: This demo doesn't work!
// This is due, at least, to a bug in the Scheduler
// where it tries to evaluate scheduled events immediatey
// even if the clock hasn't started ticking yet.
fluid.defaults("berg.examples.autoAudioContextClock", {
    gradeNames: "fluid.viewComponent",

    components: {
        scheduler: {
            type: "berg.scheduler",

            options: {
                components: {
                    clock: {
                        type: "berg.clock.autoAudioContext",
                        options: {
                            freq: 1
                        }
                    }
                }
            }
        }
    },

    invokers: {
        blink: {
            funcName: "berg.examples.autoAudioContextClock.blink",
            args: "{that}.dom.blinky"
        },

        unblink: {
            funcName: "berg.examples.autoAudioContextClock.unblink",
            args: "{that}.dom.blinky"
        },

        toggleButtonState: {
            funcName: "berg.examples.autoAudioContextClock.toggleButtonState",
            args: "{that}"
        }
    },

    events: {
        onButtonClick: null
    },

    listeners: {
        "onCreate.bindButton": {
            "this": "{that}.dom.button",
            method: "on",
            args: ["click", "{that}.toggleButtonState"]
        },

        "onCreate.scheduleBlink": {
            func: "{that}.scheduler.schedule",
            args: [
                {
                    type: "repeat",
                    freq: 1,
                    time: 0,
                    callback: "{that}.blink"
                }
            ]
        },

        "onCreate.scheduleUnblink": {
            func: "{that}.scheduler.schedule",
            args: [
                {
                    type: "repeat",
                    freq: 1,
                    time: 0.5,
                    callback: "{that}.unblink"
                }
            ]
        },

        "onCreate.scheduleEnd": {
            func: "{that}.scheduler.schedule",
            args: [
                {
                    type: "once",
                    time: 15,
                    callback: "{that}.scheduler.stop"
                }
            ]
        },

        "onButtonClick.toggleButtonState": {
            func: "{that}.toggleButtonState"
        }
    },

    selectors: {
        blinky: "#blinky",
        button: "button"
    }
});

berg.examples.autoAudioContextClock.blink = function (blinky) {
    blinky.addClass("blink");
    blinky.removeClass("unblink");

};
berg.examples.autoAudioContextClock.unblink = function (blinky) {
    blinky.removeClass("blink");
    blinky.addClass("unblink");
};

berg.examples.autoAudioContextClock.toggleButtonState = function (that) {
    if (that.scheduler.clock.model.isPlaying) {
        that.scheduler.stop();
        that.locate("button").text("Start");
    } else {
        that.scheduler.start();
        that.locate("button").text("Stop");
    }
};
