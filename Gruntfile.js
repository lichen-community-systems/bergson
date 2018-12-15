/* eslint-env node */

"use strict";

module.exports = function (grunt) {

    var files = {
        infusion: [
            "node_modules/infusion/src/framework/core/js/jquery.standalone.js",
            "node_modules/infusion/src/framework/core/js/Fluid.js",
            "node_modules/infusion/src/framework/core/js/FluidDebugging.js",
            "node_modules/infusion/src/framework/core/js/FluidIoC.js",
            "node_modules/infusion/src/framework/core/js/DataBinding.js"
        ],

        bergson: [
            "src/js/clock.js",
            "src/js/priority-queue.js",
            "src/js/postmessage-utils.js",
            "src/js/scheduler.js",
            "src/js/worker-scheduler.js",
            "src/js/raf-clock.js",
            "src/js/setinterval-clock.js",
            "src/js/clock-logger.js"
        ],

        bergsonMainThreadOnly: [
            "src/js/worker-setinterval-clock.js",
            "src/js/audiocontext-clock.js"
        ],

        workerFooter: [
            "src/js/worker-footer.js"
        ]
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        eslint: {
            all: [
                "src/**/*.js",
                "tests/**/*js"
            ]
        },

        concat: {
            options: {
                separator: ";",
                banner: "<%= berg.banners.short %>"
            },

            all: {
                src: [].concat(files.infusion, files.bergson, files.bergsonMainThreadOnly),
                dest: "dist/<%= pkg.name %>-all.js"
            },

            only: {
                src: [].concat(files.bergson, files.bergsonMainThreadOnly),
                dest: "dist/<%= pkg.name %>-only.js"
            },

            worker: {
                src: [].concat(files.infusion, files.bergson, files.workerFooter),
                dest: "dist/<%= pkg.name %>-all-worker.js"
            }
        },

        uglify: {
            options: {
                banner: "<%= berg.banners.short %>",
                beautify: {
                    ascii_only: true
                }
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: "dist/",
                        src: ["*.js"],
                        dest: "dist/",
                        ext: ".min.js",
                    }
                ]
            }
        },

        clean: {
            all: {
                src: ["dist/"]
            }
        },

        berg: {
            banners: {
                short: "/*! Bergson <%= pkg.version %>, Copyright <%= grunt.template.today('yyyy') %> Colin Clark | github.com/colinbdclark/bergson */\n\n"
            }
        }
    });

    // Load relevant Grunt plugins.
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("fluid-grunt-eslint");

    grunt.registerTask("default", ["clean", "eslint", "concat", "uglify"]);
};
