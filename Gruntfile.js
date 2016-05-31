var Habitat = require('habitat');
var saveLicense = require('uglify-save-license');

Habitat.load('.env');

var
  env = new Habitat('', {
    aws_s3_bucket: 's3.fightforthefuture.org'
  });

module.exports = function (grunt) {
  "use strict";

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {});

  grunt.initConfig({
    meta :{
      project: 'fftf-campaign-boilerplate',
      port: '9000'
    },

    site: {
      app: 'site',
      assets: 'assets',
      dist: 'public',
      javascript: [
        'js/LICENSE',
        'js/main.js'
      ]
    },

    clean: [
      '<%= site.dist %>/*',
      '<%= site.assets %>/*'
    ],

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        dest: '<%= site.dist %>',
        src: '<%= site.app %>'
      },
      build: {
        options: {
          config: '_config.yml,_config.build.yml'
        }
      },
      server: {
        options: {
          incremental: true
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },

    copy: {
      server: {
        files: [
          {
            expand: true,
            dot: true,
            src: 'images/**/*.{gif,png,jpg,jpeg,svg}',
            dest: '<%= site.dist %>'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            dot: true,
            src: 'images/**/*.{gif,png,jpg,svg}',
            dest: '<%= site.assets %>'
          }
        ]
      }
    },

    less: {
      options: {
        compress: false,
        sourceMap: true
      },
      server: {
        files: [
          {
            expand: true,
            cwd: 'less',
            src: '*.less',
            dest: '<%= site.dist %>/css',
            ext: '.css'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            cwd: 'less',
            src: '*.less',
            dest: '<%= site.assets %>/css',
            ext: '.css'
          }
        ]
      }
    },

    postcss: {
      options: {
        map: {
          prev: 'css/',
          inline: false
        },
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')()
        ]
      },
      server: {
        files: [
          {
            expand: true,
            cwd: '<%= site.dist %>/css',
            src: '*.css',
            dest: '<%= site.dist %>/css'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            cwd: '<%= site.assets %>/css',
            src: '*.css',
            dest: '<%= site.assets %>/css'
          }
        ]
      }
    },

    concat: {
      options: {
        sourceMap: true
      },
      server: {
        files: [
          {
            src: '<%= site.javascript %>',
            dest: '<%= site.dist %>/js/core.js'
          }
        ]
      },
      deploy: {
        files: [
          {
            src: '<%= site.javascript %>',
            dest: '<%= site.assets %>/js/core.js'
          }
        ]
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        check: 'gzip',
        preserveComments: saveLicense
      },
      deploy: {
        files: {
          '<%= site.assets %>/js/core.js': '<%= site.assets %>/js/core.js'
        }
      }
    },

    cdnify: {
      deploy: {
        options: {
          rewriter: function (url) {
            var
              stamp = Date.now();
            if (url[0] === '/') {
              return 'https://' + env.get('aws_s3_bucket') + '<%= meta.project %>' + url + '?' + stamp;
            } else {
              return url;
            }
          }
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: '**/*.html',
          dest: '<%= site.dist %>'
        }, {
          expand: true,
          cwd: '<%= site.assets %>',
          src: '**/*.css',
          dest: '<%= site.assets %>'
        }]
      }
    },

    concurrent: {
      server: [
        'jekyll:server',
        'less:server',
        'concat:server',
        'copy:server'
      ],
      review: [
        'jekyll:review',
        'less:server',
        'concat:server',
        'copy:server'
      ],
      deploy1: [
        'jekyll:build',
        'less:deploy',
        'concat:deploy',
        'copy:deploy'
      ],
      deploy2: [
        'uglify:deploy',
        'cdnify:deploy'
      ]
    },

    connect: {
      options: {
        open: true,
        hostname: '0.0.0.0',
        port: '<%= meta.port %>',
        middleware: function (connect, options, middlewares) {
          middlewares.unshift(function (request, response, next) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            return next();
          });
          return middlewares;
        },
        useAvailablePort: true
      },
      local: {
        options: {
          base: '<%= site.dist %>'
        }
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      images: {
        files: ['images/**/*.*'],
        tasks: ['copy:server']
      },
      less: {
        files: ['less/**/*.less'],
        tasks: ['less:server', 'postcss:server']
      },
      javascript: {
        files: ['js/**/*.js'],
        tasks: ['concat:server']
      },
      jekyll: {
        files: [
          '_*.*',
          '<%= site.app %>/**/*.{xml,html,yml,md,mkd,markdown,rb,txt}'
        ],
        tasks: ['jekyll:server']
      }
    }
  });

  grunt.registerTask('dev', [
    'clean',
    'concurrent:server',
    'postcss:server',
    'connect:local',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concurrent:deploy1',
    'concurrent:deploy2'
  ]);

  grunt.registerTask('review', [
    'clean',
    'concurrent:review',
    'postcss:server'
  ]);

  grunt.registerTask('test', [
    'jekyll:check'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
