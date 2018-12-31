fluid.defaults("berg.examples.autoAudioContextClock", {
    gradeNames: "fluid.viewComponent",

    blinkSchedule: {
        type: "repeat",
        freq: 1,
        time: 0,
        end: 15,
        callback: "{blinker}.blink"
    },

    unblinkSchedule: {
        type: "repeat",
        freq: 1,
        time: 0.5,
        end: 15.5,
        callback: "{blinker}.unblink"
    },

    model: {
        isPlaying: false
    },

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
        },

        button: {
            type: "berg.examples.schedulerToggleButton",
            container: "{autoAudioContextClock}.dom.button"
        },

        blinker: {
            type: "berg.examples.blinker",
            container: "{autoAudioContextClock}.dom.blinky"
        },

        counter: {
            type: "berg.examples.tickCounter",
            container: "{autoAudioContextClock}.dom.counter"
        }
    },

    invokers: {
        stop: {
            changePath: "isPlaying",
            value: false
        }
    },

    events: {
        onStart: "{scheduler}.events.onStart",
        onStop: "{scheduler}.events.onStop"
    },

    listeners: {
        "onCreate.scheduleCounter": {
            func: "{scheduler}.schedule",
            args: [
                {
                    type: "repeat",
                    freq: 1,
                    time: 1,
                    callback: "{counter}.count"
                }
            ]
        },

        "onStart.scheduleBlink": {
            priority: "before:updateState",
            func: "{scheduler}.schedule",
            args: ["{that}.options.blinkSchedule"]
        },

        "onStart.scheduleUnblink": {
            priority: "before:updateState",
            func: "{scheduler}.schedule",
            args: ["{that}.options.unblinkSchedule"]
        },

        "onStop.unscheduleBlink": {
            func: "{scheduler}.clear",
            args: ["{that}.options.blinkSchedule"]
        },

        "onStop.unscheduleUnblink": {
            func: "{scheduler}.clear",
            args: ["{that}.options.unblinkSchedule"]
        }
    },

    selectors: {
        blinky: ".blinky",
        button: "button",
        counter: ".counter"
    }
});
