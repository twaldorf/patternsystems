const fs = require('fs') // this engine requires the fs module

const cannon = (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    try {
      const string = content.toString()

      var renderedString = string.replace(/\{([^}]+)\}/g, (_, num) => options[num])

      while (renderedString.match(/\{([^}]+)\}/g)) {
        var renderedString = renderedString.replace(/\{([^}]+)\}/g, (_, num) => options[num])
      }

      return callback(null, renderedString)
    } catch (e) {
      return callback(e)
    }
  })
}

module.exports = { cannon }
