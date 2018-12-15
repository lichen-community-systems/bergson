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
            args: "{that}.container"
        },

        unblink: {
            funcName: "berg.examples.autoAudioContextClock.unblink",
            args: "{that}.container"
        }
    },

    listeners: {
        "onCreate.startScheduler": {
            func: "{that}.scheduler.start"
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
        }
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
