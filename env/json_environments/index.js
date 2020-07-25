const fs = require('fs')

var jsonFile = "default.json"
if(process.env.NODE_ENV)
{
  jsonFile = process.env.NODE_ENV + '.json';
  if(!fs.existsSync(__dirname+jsonFile))
  {
    jsonFile = 'default.json'
  }
}

var jsonENV = require('./json-to-env');

var config ={}
config.input = __dirname+'/default.json'
config.output = __dirname+'/../.env'
jsonENV(config);