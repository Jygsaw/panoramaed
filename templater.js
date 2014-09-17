// initializing required libraries
var fs = require('fs');

// initializing variables
var templateFilename = process.argv[2];
var dataFilename = process.argv[3];
var outputFilename = process.argv[4];

// TODO remove debugging and collapse variable names
console.log("Executing Templater");
console.log("  template:", templateFilename);
console.log("  data:", dataFilename);
console.log("  output:", outputFilename);

// read and initialize data
var data = JSON.parse(fs.readFileSync(dataFilename));

// initialize read and write streams
var readStream = fs.createReadStream(templateFilename);
var writeStream = fs.createWriteStream(outputFilename);

// process incoming file
readStream.on('readable', processFile);

function processFile() {
  while(line = readStream.read()) {
    // if (line) {
    //   console.log(line.toString());      
    // }
    writeStream.write(line);
  }
}
