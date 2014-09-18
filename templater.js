// initialize libraries
var fs = require('fs');

// initialize variables
var data = JSON.parse(fs.readFileSync(process.argv[3]));
var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[4]);
var tokenLogic = {
  EACH: processEach,
};

// map data token to data value
function lookup(data, pathStr) {
  var parts = pathStr.split('.').reverse();
  var result = data;
  while (parts.length) {
    result = result[parts.pop()];
  }
  return result;
}

// process input file line by line
function processLines(lines, endToken) {
// TODO remove debugging
// console.log("===== PROCESSING =====");
  var result = [];
  var line;
  // iterate while available line does not match endtoken
  while ((line = lines.pop()) &&
          !(endToken && line.match(endToken))) {
// TODO remove debugging
// console.log("line:", line);
    var tokenRegex = /<\*\s*(\S+)\s*(.*?)\s*\*>/;
    // var tokenRegex = /<\*\s*(\S+)\s*(.+?)\s*\*>/;
    var match = line.match(tokenRegex);
// TODO remove debugging
// console.log(match);
    if (match && tokenLogic[match[1]]) {
      // collect lines
      var logicLines = processLines(lines, 'END' + match[1]);

      // perform token logic and add to output
      result = result.concat(tokenLogic[match[1]](match[2], logicLines));
    } else {
      // substitute data tokens with data values
      var dataRegex = new RegExp(tokenRegex.source, "g");
      line = line.replace(dataRegex, function() {
        var newVal = lookup(data, arguments[1]);
        return newVal !== undefined ? newVal : arguments[0];
      });

      // add line to output
      result.push(line);
    }
  }
  return result;
}

// handle EACH processing
function processEach(argStr, lines) {
  console.log("===== PROCESSING EACH =====");
  var args = argStr.split(' ');

  var result = [];
  var eachArr = lookup(data, args[0]);
  for (var i = 0; i < eachArr.length; i++) {
    result = result.concat(lines);
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
