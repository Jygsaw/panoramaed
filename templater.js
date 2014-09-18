// initialize libraries
var fs = require('fs');

// initialize variables
var data = JSON.parse(fs.readFileSync(process.argv[3]));
var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[4]);
var tokenLogic = {
  EACH: processEach,
};

// map data key to data value
function lookup(data, pathStr) {
  var result = data;
  var path = pathStr.split('.').reverse();
  while (path.length) {
    var key = path.pop();
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
}

// process input file line by line
function processLines(lines, data, endToken) {
  var result = [];
  // iterate while available line does not match endtoken
  while (lines.length) {
    var line = lines.pop();

    // stop parsing if endToken detected
    if (endToken && line.match(endToken)) {
      break;
    }

    // check for token logic
    var tokenRegex = /<\*\s*(\S+)\s*(.*?)\s*\*>/;
    var match = line.match(tokenRegex);
    if (match && tokenLogic[match[1]]) {
      // select token logic lines
      var logicLines = processLines(lines, data, 'END' + match[1]);

      // add token logic results to output
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

// handle EACH expansion
function processEach(argStr, data, lines) {
  var result = [];
  var args = argStr.split(' ');
  var elems = lookup(data, args[0]);
  for (var i = 0; i < elems.length; i++) {
    var subLines = Array.prototype.slice.call(lines).reverse();
    var subData = {};
    subData[args[1]] = elems[i];
    result = result.concat(processLines(subLines, subData));
  }

  return result;
}

// process template
readStream.on('readable', function() {
  var lineStack = readStream.read().toString().split('\r\n').reverse();
  writeStream.write(processLines(lineStack, data).join('\r\n'));
});
