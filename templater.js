// initialize libraries
var fs = require('fs');

// initialize variables
var data = JSON.parse(fs.readFileSync(process.argv[3]));
var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[4]);
var tokenLogic = {
  EACH: function() { return 'stuff'; },
};

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
function processLines(lines) {
  var result = [];
  var line;
  while (line = lines.pop()) {
    var tokenRegex = /<\*\s*(\S*)?\s*?(.+?)\s*\*>/;
    var match;
    while (match = line.match(tokenRegex)) {
console.log("logic key:", match[1]);
console.log("data key:", match[2]);
      if (tokenLogic[match[1]]) {
        // collect lines and perform token logic
console.log("token logic detected!!!");
        line = tokenLogic[match[1]]();
      } else {
        // substitute data token with data value
        line = line.replace(tokenRegex, lookup(data, match[1]));
      }
    }
    result.push(line);
  }
  return result;
}

// process template
readStream.on('readable', function() {
  var lineStack = readStream.read().toString().split('\r\n').reverse();
  processLines(lineStack).forEach(function(data) {
    writeStream.write(data + '\r\n');
  });
});
