// initializing required libraries
var fs = require('fs');

// initializing variables
var templateFilename = process.argv[2];
var dataFilename = process.argv[3];
var outputFilename = process.argv[4];

// TODO remove debugging
console.log("Executing Templater");
console.log("  template:", templateFilename);
console.log("  data:", dataFilename);
console.log("  output:", outputFilename);
