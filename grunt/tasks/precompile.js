module.exports = function(grunt) {
  grunt.registerTask('precompile', ['clean:dist', 'sass:dist']);
};
