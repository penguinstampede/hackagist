module.exports = {
  sass: {
    files: ['assets/scss/*.{sass,scss,css}'],
    tasks: ['sass:dev']
  },
  uglify: {
    files: ['assets/js/*.js'],
    tasks: ['uglify:dev']
  },
  copy: {
    files: ['assets/ejs/*.ejs'],
    tasks: ['copy']
  },
  express: {
    files:  [ '/*.js' ],
    tasks:  [ 'express' ],
    options: {
      spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
    }
  }
};
