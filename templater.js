// initialize libraries
var fs = require('fs');

// initialize variables
var data = JSON.parse(fs.readFileSync(process.argv[3]));
var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[4]);
var tokenCmds = {
  EACH: processEach,
  // add extra commands with key = "<CMD>" and
  // val = function definition
};

// map data key to data value
function lookup(data, pathStr) {
  var result = data;
  var path = pathStr.split('.');
  for (var i = 0; i < path.length; i++) {
    var key = path[i];
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
  // iterate while lines available
  while (lines.length) {
    var line = lines.pop();

    // stop parsing if endToken detected
    if (endToken && line.match(endToken)) {
      break;
    }

    // check for token commands
    var commandRegex = /<\*\s*(\S+)\s*(.*?)\s*\*>/;
    var match = line.match(commandRegex);
    if (match && tokenCmds[match[1]]) {
      // add token command results to output
      var logicResult = tokenCmds[match[1]](lines, data, match[2]);
      result = result.concat(logicResult);
    } else {
      // substitute data tokens with data values
      // NOTE: using global replace to handle multiple
      //       tokens on one line; skip replace if lookup
      //       returns undefined value
      var dataRegex = /<\*\s*(\S+)\s*\*>/g;
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
function processEach(lines, data, argStr) {
  var result = [];
  var args = argStr.split(' ');
  var elems = lookup(data, args[0]);

  // create output results for each value found
  for (var i = 0; i < elems.length; i++) {
    var subLines = lines;
    if (i < elems.length - 1) {
      // modify duplicate if more than one elem
      subLines = Array.prototype.slice.call(subLines);
    }

    // create subcontext for data values
    var subData = {};
    subData[args[1]] = elems[i];

    // call processLines to recursively handle nesting
    // and token substitution
    result = result.concat(processLines(subLines, subData, 'ENDEACH'));
  }
  return result;
}

// MAIN: process template
readStream.on('readable', function() {
  // NOTE: using stack, via reversed array with pop(), instead of
  //       queue, via array with shift(), because shifting off
  //       elements from head as template processed would cause
  //       constant reindexing
  var lineStack = readStream.read().toString().split('\r\n').reverse();
  writeStream.write(processLines(lineStack, data).join('\r\n'));
});
