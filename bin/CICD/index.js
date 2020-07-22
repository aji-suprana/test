#!/usr/bin/env node
const argv = require('yargs').argv
const fs = require('fs');
const lodash = require('lodash');
const path = require('path')
const debug = require('../../app/services/debug');
if(argv._.length > 2)
{
  console.log("ERROR : run one command at a time");
  return;
}

var scripts = {};

fs
.readdirSync(path.join(__dirname,'src'))
.filter(file => (file.indexOf(".") !== 0) && (file !== "index.js") && (file.match(/(^.\w\-)*\.js$/)))
.forEach((res) => {
  var scriptName = res.split('.')[0];
  scripts[scriptName] = require('./src/'+res);
})

var command = argv._[0];

if(lodash.has(scripts,command))
{
  scripts[command](argv);
}
else
{
  debug.logError("INVALID_COMMAND "+command);
}