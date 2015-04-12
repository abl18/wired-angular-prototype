module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserSync: {
      dev: {
        bsFiles: {
          src : 'app/css/*.css'
        },
        options: {
          watchTask: true
          // proxy: "wired.local/"
        }
      }
    },
    stylus: {
      compile: {
        options: {
            compress: false,
            'include css' : true,
            'resolve url': true
        },
        files: {
          'app/css/style.css': 'app/styl/style.styl' // 1:1 compile
        }
      }
    },
    autoprefixer: {
        options: {
          browsers: ['ff 15', 'chrome 25', 'ie 8']
        },
        no_dest: {
          src: 'app/css/style.css'
        }
    },
    jshint: {
      // options here to relax or expand JSHint error messages, mostly expand
      options: {
        bitwise: true, // no bitwise operators, confusing
        browser: true, // browser env, not node, etc. recognizes console, document, etc
        curly: true, // always use {}
        es3: true, // checks for compatibility with ie 6/7/8/9
        esnext: true, // don't freak if es6 is used
        eqeqeq: true, // == is bad, === is bettergrunt
        forin: true, // enforce best for in loop practice
        freeze: true, // dont allow overwriting of native objects like Array, Date
        immed: true, // force IIFE best practice
        indent: 2, // cause i hate anything more than that, personal pref
        latedef: 'nofunc', // dont freak if functions are called before being defined
        newcap: true, // force constructor best practices
        noarg: true, // don't allow arguments.callee (use array.prototype.slice instead)
        node: true, // don't freak if using node
        noempty: true, // check for empty blocks
        nonew: true, // more constructor best practices
        quotmark: 'single', // i prefer single quotes personally
        undef: true, // no undeclared vars, use /*global*/ to define out of file vars
        // unused: true, // warns of unused vars

        // maxcomplexity: true, interesting as a quick snapshot of code complexity

        // pre-defined globals
        globals: {
          angular: true, // aaaaangular
          _: true, // underscore / lodash
          $h: true, // hearst
          CN: true, // conde
          Headroom: true, // http://wicky.nillia.ms/headroom.js/
          jQuery: true, // you know what this is
          OBR: true, // outbrain
          Wired: true // duh
        }
      },
      all: [
        '!gruntfile.js',
        'app/js/controllers/**/*.js',
        'app/js/factories/**/*.js',
        'app/js/directives/**/*.js',
        'app/js/app.js'
      ]
    },
    // unit testing, would be good to implement
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    concat: {
      dist: {
        src: [
          'app/js/vendor/Wired.min.js',
          'app/js/factories/main.js',
          'app/js/controllers/grid.js',
          'app/js/controllers/sectionCard.js',
          'app/js/controllers/recirc.js',
          'app/js/controllers/react.js',
          'app/js/directives/sectionGet.js',
          'app/js/app.js'
        ],
        dest: 'app/js/dist/app.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        compress: true, // you know what this does
        conditionals: true, // optimize conditionals
        dead_code: true, // remove unreachable code
        hoist_vars: true, // should be doing as best practice anyway
        loops: true, // optimize loops if possible
        mangle: false, // shorten var names, etc
        sourceMap: true, // generate source map so we can work with minified code
        // sourceMapIncludeSources: true, // do same for imports
        wrap: true // make sure output is wrapped in iife (no globals)

        /**
         * for modules. works with wrap, wraps globals and uses module.export to reveal them. will be more useful in future due to es6 (or node.js, in the present)
         * exportAll: true
         */
      },
      dist: {
        files: {
          'app/js/dist/app.min.js' : ['app/js/dist/app.js']
        }
      }
    },
    // svgmin: {
    //   options: {
    //     plugins: [
    //       { removeViewBox: true },
    //       { removeUselessStrokeAndFill: true },
    //       { removeEmptyAttrs: true }
    //     ]
    //   },
    //   dist:  {
    //     files: {
    //       // @TODO make this dynamic
    //       'images/ui/comments.svg': 'images/ui/comments.svg',
    //       'images/ui/comments-active.svg': 'images/ui/comments-active.svg',
    //       'images/ui/fb.svg': 'images/ui/fb.svg',
    //       'images/ui/fb-active.svg': 'images/ui/fb-active.svg',
    //       'images/ui/mail.svg': 'images/ui/mail.svg',
    //       'images/ui/mail-active.svg': 'images/ui/mail-active.svg',
    //       'images/ui/pint.svg': 'images/ui/pint.svg',
    //       'images/ui/pint-active.svg': 'images/ui/pint-active.svg',
    //       'images/ui/twit.svg': 'images/ui/twit.svg',
    //       'images/ui/twit-active.svg': 'images/ui/twit-active.svg'
    //     }
    //   }
    // },
    // 'svg-sprites': {
    //   dist: {
    //     options: {
    //       spriteElementPath: 'images/ui',
    //       spritePath: 'images/ui/sprite',
    //       cssPath: 'images/ui/sprite/css',
    //       cssSuffix: 'css',
    //       prefix: 'ui',
    //       sizes: {
    //         std: 18
    //       },
    //       refSize: 17,
    //       unit: 20
    //     }
    //   }
    // },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: [
          '!gruntfile.js',
          'app/js/*' // watch all our custom js
        ],
        tasks: ['compile']
      },
      css: {
        // We watch and compile styl files as normal but don't live reload here
        files: ['**/*.styl'],
        tasks: ['styl'],
        livereload: true
      },
      livereload: {
        files: [
          'app/css/style.css',
          'app/js/*',
          'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  // TASKS =====================================/
  // grunt jshint -> compile
  grunt.registerTask('compile', ['jshint', 'concat', 'uglify']);
  // grunt stylus -> compile css
  grunt.registerTask('styl', ['stylus', 'autoprefixer']);
  // grunt monitor -> just turn on watching and browser sync
  grunt.registerTask('monitor', ['watch' /*,'browserSync'*/]);
  // grunt design -> compile css and watch for changes
  grunt.registerTask('design', ['styl', 'monitor']);
  // grunt dev -> test and compile js, set up browsersync / watching
  grunt.registerTask('dev', ['compile', 'monitor']);
  // grunt -> compile both css and js
  grunt.registerTask('default', ['styl', 'compile', 'monitor']);

};