module.exports = {
  dev: {
    files: {
      'public/assets/js/app.js': ['assets/bower/mustache.js/mustache.js','assets/js/app.js']
    },
    options: {
      sourceMap: true,
      beautify: true
    }
  },
  dist: {
    files: {
      'public/assets/js/app.js': ['assets/bower/mustache.js/mustache.js','assets/js/app.js']
    },
    options:{
      sourceMap: false,
      compress: true
    }
  }
};
