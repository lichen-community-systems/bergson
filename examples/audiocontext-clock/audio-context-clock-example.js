fluid.defaults("berg.examples.autoAudioContextClock", {
    gradeNames: "fluid.viewComponent",

    blinkSchedule: {
        id: "blink",
        type: "repeat",
        freq: 1,
        time: 0,
        end: 15,
        callback: "{blinker}.blink"
    },

    unblinkSchedule: {
        id: "unblink",
        type: "repeat",
        freq: 1,
        time: 0.5,
        end: 15.5,
        callback: "{blinker}.unblink"
    },

    components: {
        scheduler: {
            type: "berg.scheduler",

            options: {
                components: {
                    clock: {
                        type: "berg.clock.autoAudioContext"
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

    events: {
        onStart: "{scheduler}.events.onStart",
        onStop: "{scheduler}.events.onStop"
    },

    listeners: {
        "onCreate.scheduleCounter": {
            func: "{scheduler}.schedule",
            args: [
                {
                    id: "count",
                    type: "repeat",
                    freq: 1,
                    time: 1,
                    callback: "{counter}.count"
                }
            ]
        },

        "onStart.scheduleBlink": {
            func: "{scheduler}.schedule",
            args: ["{that}.options.blinkSchedule"]
        },

        "onStart.scheduleUnblink": {
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
