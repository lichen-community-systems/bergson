fluid.defaults("berg.examples.blinker", {
    gradeNames: "fluid.viewComponent",

    invokers: {
        blink: "{that}.events.onBlink.fire()",
        unblink: "{that}.events.onUnblink.fire()"
    },

    events: {
        onStop: "{autoAudioContextClock}.events.onStop",
        onBlink: null,
        onUnblink: null
    },

    listeners: {
        "onStop.unblink": {
            func: "{that}.unblink"
        },

        "onBlink.addBlinkClass": {
            "this": "{that}.container",
            method: "addClass",
            args: ["blink"]
        },

        "onBlink.removeUnblinkClass": {
            "this": "{that}.container",
            method: "removeClass",
            args: ["unblink"]
        },

        "onUnblink.addUnblinkClass": {
            "this": "{that}.container",
            method: "addClass",
            args: ["unblink"]
        },

        "onUnblink.removeBlinkClass": {
            "this": "{that}.container",
            method: "removeClass",
            args: ["blink"]
        }
    }
});
