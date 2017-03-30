module.exports = function(grunt) {
  grunt.registerTask('dev', ['sass:dev','uglify:dev','copy','express:dev','watch']);
};
