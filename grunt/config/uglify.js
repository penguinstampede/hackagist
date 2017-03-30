module.exports = {
  dev: {
    files: {
      'public/assets/js/vendor.js': ['node_modules/ejs/ejs.js','node_modules/numeral/numeral.js','node_modules/moment/moment.js','assets/bower/masonry/dist/masonry.pkgd.js','assets/bower/imagesloaded/imagesloaded.pkgd.js'],
      'public/assets/js/app.js': ['assets/js/projects.js','assets/js/owners.js','assets/js/tooltip.js','assets/js/app.js']
    },
    options: {
      sourceMap: true,
      beautify: true
    }
  },
  dist: {
    files: {
      'public/assets/js/vendor.js': ['node_modules/ejs/ejs.js','node_modules/numeral/numeral.js','node_modules/moment/moment.js','assets/bower/masonry/dist/masonry.pkgd.js','assets/bower/imagesloaded/imagesloaded.pkgd.js'],
      'public/assets/js/app.js': ['assets/js/projects.js','assets/js/owners.js','assets/js/tooltip.js','assets/js/app.js']
    },
    options:{
      sourceMap: false,
      compress: true
    }
  }
};
