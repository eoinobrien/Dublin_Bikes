module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'css/app.css' : 'css/app.sass'
        }/*,
        options: {
          style: 'compressed'
        }*/
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'css/*.css',
            'js/*.js',
            'pages/*.html',
            '*.html'
          ]
        },
        options: {
          server: {
            baseDir: "./",
            watchTask: true
          }
        }
      }
    },
    watch: {
      css: {
        files: ['**/*.scss','**/*.sass'],
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.registerTask('default',["browserSync","watch"]);
}