module.exports = {
  dev:{
    files: [
      // includes files within path and its sub-directories
      {
        expand: true,
        cwd: 'assets/ejs/',
        src: ['**'],
        dest: 'public/assets/ejs/'
      }
    ]
  }
}
