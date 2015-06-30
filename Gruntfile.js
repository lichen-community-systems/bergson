/*global module*/

module.exports = function(grunt) {
    "use strict";

    var files = {
        jQuery: [
            "third-party/jquery/js/jquery.js"
        ],

        infusion: [
            "third-party/infusion/js/Fluid.js",
            "third-party/infusion/js/FluidDocument.js",
            "third-party/infusion/js/FluidDOMUtilities.js",
            "third-party/infusion/js/FluidDebugging.js",
            "third-party/infusion/js/FluidIoC.js",
            "third-party/infusion/js/FluidPromises.js",
            "third-party/infusion/js/FluidRequests.js",
            "third-party/infusion/js/ModelTransformation.js",
            "third-party/infusion/js/ModelTransformationTransforms.js",
            "third-party/infusion/js/FluidView.js",
            "third-party/infusion/js/FluidRequests.js"
        ],

        bergson: [
            "src/js/clock.js",
            "src/js/priority-queue.js",
            "src/js/scheduler.js",
            "src/js/raf-clock.js",
            "src/js/setinterval-clock.js",
            "src/js/worker-setinterval-clock.js",
            "src/js/clock-logger.js"
        ]
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            all: [
                "src/**/*.js",
                "tests/**/*js",
                "!**/third-party/**"
            ],
            options: {
                jshintrc: true
            }
        },

        concat: {
            options: {
                separator: ";",
                banner: "<%= berg.banners.short %>"
            },

            all: {
                src: [].concat(files.jQuery, files.infusion, files.bergson),
                dest: "dist/<%= pkg.name %>-all.js"
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
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("default", ["clean", "jshint", "concat", "uglify"]);
};
