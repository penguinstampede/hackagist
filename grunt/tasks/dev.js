module.exports = function(grunt) {
  grunt.registerTask('dev', ['sass:dev','uglify:dev','express:dev','watch']);
};
