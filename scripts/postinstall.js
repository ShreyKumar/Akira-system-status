'use strict';

var fs = require("fs")

console.log("Writing Typescript Definition file")
fs.writeFile("node_modules/react-analog-clock/index.d.ts", "declare module 'react-analog-clock';", function(err){
  if(err){
    return console.log(err)
  }

  console.log("File saved!")
})
