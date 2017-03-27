module.exports = {
  options: {
    sourceMap: true
  },
  dev: {
    files: {
      'public/assets/css/app.css': 'assets/scss/app.scss'
    },
    options:{
      includePaths: ['assets/bower']
    }
  },
  dist: {
    files: {
      'public/assets/css/app.css': 'assets/scss/app.scss'
    },
    options:{
      sourceMap: false,
      outputStyle: 'compressed',
      includePaths: ['assets/bower']
    }
  }
};
