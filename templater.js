// initialize libraries
var fs = require('fs');

// initialize data, read, and write streams
var data = JSON.parse(fs.readFileSync(process.argv[3]));
var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[4]);

// map data token to data value
function lookup(data, path) {
  var parts = path.split('.').reverse();
  var result = data;
  while (parts.length) {
    result = result[parts.pop()];
  }
  return result;
}

// process input file line by line
function processFile() {
  while (line = readStream.read()) {
    line = line.toString();
    var tokenRegex = /<\*\s*(.+?)\s*\*>/;
    var match;
    while (match = line.match(tokenRegex)) {
      // substitute data token with data value
      line = line.replace(tokenRegex, lookup(data, match[1]));
    }
    writeStream.write(line);
  }
}

// process template
readStream.on('readable', processFile);
