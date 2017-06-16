/**
 * @file
 * Grunt configurations.
 */

module.exports = function (grunt) {
  grunt.initConfig({
    env: grunt.option('env') || process.env.NODE_ENV || 'development',
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.config('watch', {
    source: {
      files: ['src/scss/**/*.scss', 'src/js/**/*.js'],
      tasks: ['build']
    }
  });

  grunt.config('browserSync', {
    bsFiles: {
      src : [
        './docs/css/*.css',
        './docs/js/*.js',
        './docs/*.html'
      ]
    },
    options: {
      server: {
        baseDir: "./docs"
      }
    }
  });

  grunt.config('concurrent', {
    options: {
      logConcurrentOutput: true
    },
    tasks: ['browserSync', 'watch']
  });

  grunt.config('postcss', {
    options: {
      syntax: require('postcss-scss'),
      processors: [
        require('autoprefixer')({ browsers: ['last 3 version', 'ff >= 36', 'ie >= 11'] }),
        require('postcss-discard-duplicates')(),
      ],
      map: {
        inline: false
      }
    },
    dist: {
      options: {
        map: false,
        processors: [
          require('cssnano')()
        ]
      },
      src: 'docs/css/**/*.css'
    },
    dev: {
      src: 'docs/css/**/*.css'
    }
  });

  grunt.config('sass', {
    options: {
      outputStyle: 'expanded',
      sourceMap: true,
      indentedSyntax: true,
      sassDir: 'src/scss',
      cssDir: 'docs/css',
      includePaths: [
        'node_modules/normalize-scss/sass',
        'node_modules/modularscale-sass/stylesheets',
        'node_modules/typi/scss',
        'node_modules/madsauce/scss'
      ]
    },
    dev: {
      files: [{
        expand: true,
        cwd: 'src/scss/',
        src: ['**/*.scss'],
        dest: 'docs/css/',
        ext: '.css'
      }]
    },
    dist: {
      options: {
        sourceMap: false
      },
      files: [{
        expand: true,
        cwd: 'src/scss/',
        src: ['**/*.scss'],
        dest: 'docs/css/',
        ext: '.css'
      }]
    }
  });

  grunt.registerTask('build', ['sass:dev', 'postcss:dev']);
  grunt.registerTask('dist', ['sass:dist', 'postcss:dist']);
  grunt.registerTask('default', ['concurrent']);
};
