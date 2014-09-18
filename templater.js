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
function processLines(lines, data, endToken) {
// TODO remove debugging
// console.log("===== PROCESSING =====");
// console.log(lines);
  var result = [];
  var line;
  // iterate while available line does not match endtoken
  while (lines.length) {
    line = lines.pop();

    // stop parsing if endToken detected
    if (endToken && line.match(endToken)) {
      break;
    }

// TODO remove debugging
// console.log("line:", line);
    var tokenRegex = /<\*\s*(\S+)\s*(.*?)\s*\*>/;
    var match = line.match(tokenRegex);
// TODO remove debugging
// console.log(match);
    if (match && tokenLogic[match[1]]) {
// console.log("token logic detected");
      // collect lines
// console.log("big lines");
// console.log(lines);
      var logicLines = processLines(lines, data, 'END' + match[1]);
// console.log("logic lines");
// console.log(logicLines);
// console.log("big lines");
// console.log(lines);
      // perform token logic and add to output
      result = result.concat(tokenLogic[match[1]](match[2], data, logicLines));
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
function processEach(argStr, data, lines) {
  console.log("===== PROCESSING EACH =====");
  var args = argStr.split(' ');
// TODO remove debugging
// console.log(args);
// console.log(data);

  var result = [];
  var eachArr = lookup(data, args[0]);
  for (var i = 0; i < eachArr.length; i++) {
    var subLines = Array.prototype.slice.call(lines).reverse();
    var subData = {};
    subData[args[1]] = eachArr[i];

// console.log(subData);
// console.log(subLines);
    result = result.concat(processLines(subLines, subData));
  }

// TODO remove debugging
// console.log(result);

  return result;
}

// process template
readStream.on('readable', function() {
  var lineStack = readStream.read().toString().split('\r\n').reverse();
  processLines(lineStack, data).forEach(function(data) {
    writeStream.write(data + '\r\n');
  });
});
