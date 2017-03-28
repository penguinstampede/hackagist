module.exports = {
  dev: {
    files: {
      'public/assets/js/vendor.js': ['node_modules/ejs/ejs.js','node_modules/numeral/numeral.js','node_modules/moment/moment.js'],
      'public/assets/js/app.js': ['assets/js/app.js']
    },
    options: {
      sourceMap: true,
      beautify: true
    }
  },
  dist: {
    files: {
      'public/assets/js/vendor.js': ['node_modules/ejs/ejs.js','node_modules/numeral/numeral.js','node_modules/moment/moment.js'],
      'public/assets/js/app.js': ['assets/js/app.js']
    },
    options:{
      sourceMap: false,
      compress: true
    }
  }
};
