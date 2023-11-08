const fs = require('fs');

const replaceInFile = (filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const result = data.replace(/chrome-extension:\/\/__MSG_%40/g, 'chrome-extension://__MSG_@');

    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) console.error(err);
    });
  });
};

// Replace %40 with @ in all .css files in the dist directory
fs.readdir('./dist', (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith('.css')) {
      replaceInFile(`./dist/${file}`);
    }
  });
});