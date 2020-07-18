const constantEnv = require('./constant');
const prod = require('./prod');
const stage = require('./stage');
const dev = require('./dev');

var envSet = {
  "production" : prod,
  "staging" : stage,
  "development" : dev,
}

var envSetKeys = Object.keys(envSet);
var constEnvKeys = Object.keys(constantEnv);

for(var i = 0; i < envSetKeys.length; i++)
{
  var envSetKey = envSetKeys[i];

  for(var j = 0; j < constEnvKeys.length; j++)
  {
    constEnvKey = constEnvKeys[j];
    envSet[envSetKey][constEnvKey] = constantEnv[constEnvKey];
  }
}

console.log(envSet);
module.exports = envSet;