module.exports = function(grunt) {
  grunt.registerTask('dev', ['sass:dev','express:dev','watch']);
};
